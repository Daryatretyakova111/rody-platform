import { randomBytes } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getOrCreateUser, getCourseBySlug, getCourses } from '@/lib/queries';
import { bundlePriceCents } from '@/lib/config';
import { buildPaymentUrl } from '@/lib/prodamus';

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  const name = String(formData.get('name') ?? '').trim() || undefined;
  const kind = String(formData.get('kind') ?? '');
  const courseSlug = String(formData.get('courseSlug') ?? '');

  if (!email || !email.includes('@')) {
    return NextResponse.json({ error: 'Некорректный email' }, { status: 400 });
  }
  if (kind !== 'course' && kind !== 'bundle') {
    return NextResponse.json({ error: 'Некорректный тип заказа' }, { status: 400 });
  }

  const user = await getOrCreateUser(email, name);
  const origin = new URL(request.url).origin;

  let courseId: number | null = null;
  let amountCents: number;
  let productName: string;
  let returnPath: string;

  if (kind === 'course') {
    const course = await getCourseBySlug(courseSlug);
    if (!course) {
      return NextResponse.json({ error: 'Курс не найден' }, { status: 404 });
    }
    courseId = course.id;
    amountCents = course.price_cents;
    productName = course.title;
    returnPath = `/courses/${course.slug}`;
  } else {
    const courses = await getCourses();
    amountCents = bundlePriceCents(courses.map((c) => c.price_cents));
    productName = 'Все три курса: подготовка к родам, роды, восстановление';
    returnPath = '/';
  }

  const prodamusOrderId = `ord_${Date.now()}_${randomBytes(4).toString('hex')}`;

  await sql`
    INSERT INTO orders (user_id, kind, course_id, prodamus_order_id, amount_cents, status)
    VALUES (${user.id}, ${kind}, ${courseId}, ${prodamusOrderId}, ${amountCents}, 'pending')
  `;

  const paymentUrl = buildPaymentUrl({
    orderId: prodamusOrderId,
    customerEmail: email,
    productName,
    amountRub: amountCents / 100,
    successUrl: `${origin}/order/success?order=${prodamusOrderId}`,
    returnUrl: `${origin}${returnPath}`,
  });

  return NextResponse.redirect(paymentUrl, { status: 303 });
}
