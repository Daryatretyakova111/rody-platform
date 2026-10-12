import { randomBytes } from 'node:crypto';
import { hash } from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getOrCreateUser, getCourseBySlug } from '@/lib/queries';
import { BUNDLE_PRICE_CENTS, BUNDLE_PAYMENT_LINK, COURSE_PAYMENT_LINKS } from '@/lib/config';
import {
  createPaymentUrl,
  isGetPlatinumConfigured,
  POSITION_PREFIX_COURSE,
  POSITION_PREFIX_COURSE_SET,
} from '@/lib/getplatinum';

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  const password = String(formData.get('password') ?? '');
  const name = String(formData.get('name') ?? '').trim() || undefined;
  const kind = String(formData.get('kind') ?? '');
  const courseSlug = String(formData.get('courseSlug') ?? '');

  if (!email || !email.includes('@')) {
    return NextResponse.json({ error: 'Некорректный email' }, { status: 400 });
  }
  if (password.length < 6) {
    return NextResponse.json({ error: 'Пароль должен быть не короче 6 символов' }, { status: 400 });
  }
  if (kind !== 'course' && kind !== 'bundle') {
    return NextResponse.json({ error: 'Некорректный тип заказа' }, { status: 400 });
  }

  let courseId: number | null = null;
  let amountCents: number;
  let productName: string;
  let positionPrefix: number;
  let returnPath: string;
  let staticPaymentUrl: string | undefined;

  if (kind === 'course') {
    const course = await getCourseBySlug(courseSlug);
    if (!course) {
      return NextResponse.json({ error: 'Курс не найден' }, { status: 404 });
    }
    courseId = course.id;
    amountCents = course.price_cents;
    productName = course.title;
    positionPrefix = POSITION_PREFIX_COURSE;
    returnPath = `/courses/${course.slug}`;
    staticPaymentUrl = COURSE_PAYMENT_LINKS[course.slug];
  } else {
    amountCents = BUNDLE_PRICE_CENTS;
    productName = 'Подготовка к родам, роды, восстановление после родов';
    positionPrefix = POSITION_PREFIX_COURSE_SET;
    returnPath = '/bundle';
    staticPaymentUrl = BUNDLE_PAYMENT_LINK;
  }

  const passwordHash = await hash(password, 12);
  const user = await getOrCreateUser(email, passwordHash, name);

  const orderRef = `ord_${Date.now()}_${randomBytes(4).toString('hex')}`;
  await sql`
    INSERT INTO orders (user_id, kind, course_id, prodamus_order_id, amount_cents, status)
    VALUES (${user.id}, ${kind}, ${courseId}, ${orderRef}, ${amountCents}, 'pending')
  `;

  // With an API key, every order gets its own payment page and GetPlatinum reports the result back
  // to /api/webhooks/getplatinum. Without one, fall back to the static payment links (access is then
  // opened manually with `npm run mark-paid`).
  if (isGetPlatinumConfigured()) {
    const origin = new URL(request.url).origin;
    try {
      const paymentUrl = await createPaymentUrl({
        orderRef,
        amountCents,
        productName,
        positionPrefix,
        userId: user.id,
        email: user.email,
        notificationUrl: `${origin}/api/webhooks/getplatinum`,
        successUrl: `${origin}/order/success`,
        failUrl: `${origin}${returnPath}`,
      });
      return NextResponse.redirect(paymentUrl, { status: 303 });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: 'Не удалось создать ссылку на оплату. Попробуйте позже.' }, { status: 502 });
    }
  }

  if (!staticPaymentUrl) {
    return NextResponse.json({ error: 'Для этого курса не настроена оплата' }, { status: 404 });
  }
  return NextResponse.redirect(staticPaymentUrl, { status: 303 });
}
