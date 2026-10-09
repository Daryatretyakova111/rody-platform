import { randomBytes } from 'node:crypto';
import { hash } from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getOrCreateUser, getCourseBySlug } from '@/lib/queries';
import { BUNDLE_PRICE_CENTS, BUNDLE_PAYMENT_LINK, COURSE_PAYMENT_LINKS } from '@/lib/config';

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
  let paymentUrl: string | undefined;

  if (kind === 'course') {
    const course = await getCourseBySlug(courseSlug);
    if (!course) {
      return NextResponse.json({ error: 'Курс не найден' }, { status: 404 });
    }
    courseId = course.id;
    amountCents = course.price_cents;
    paymentUrl = COURSE_PAYMENT_LINKS[course.slug];
  } else {
    amountCents = BUNDLE_PRICE_CENTS;
    paymentUrl = BUNDLE_PAYMENT_LINK;
  }

  if (!paymentUrl) {
    return NextResponse.json({ error: 'Для этого курса не настроена оплата' }, { status: 404 });
  }

  const passwordHash = await hash(password, 12);
  const user = await getOrCreateUser(email, passwordHash, name);

  // Payment happens on an external GetPlatinum page, so this order stays 'pending'
  // until access is confirmed (see scripts/mark-paid.ts).
  const orderRef = `ord_${Date.now()}_${randomBytes(4).toString('hex')}`;
  await sql`
    INSERT INTO orders (user_id, kind, course_id, prodamus_order_id, amount_cents, status)
    VALUES (${user.id}, ${kind}, ${courseId}, ${orderRef}, ${amountCents}, 'pending')
  `;

  return NextResponse.redirect(paymentUrl, { status: 303 });
}
