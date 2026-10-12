import { randomBytes } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getOrCreateUser, getCourseBySlug } from '@/lib/queries';
import { BUNDLE_OFFER_ID, BUNDLE_PRICE_CENTS, COURSE_OFFER_IDS } from '@/lib/config';
import { createOfferPayment, isGetPlatinumConfigured } from '@/lib/getplatinum';

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
  if (!isGetPlatinumConfigured()) {
    return NextResponse.json({ error: 'Оплата временно недоступна' }, { status: 503 });
  }

  let courseId: number | null = null;
  let amountCents: number;
  let offerId: number | undefined;
  let returnPath: string;

  if (kind === 'course') {
    const course = await getCourseBySlug(courseSlug);
    if (!course) {
      return NextResponse.json({ error: 'Курс не найден' }, { status: 404 });
    }
    courseId = course.id;
    amountCents = course.price_cents;
    offerId = COURSE_OFFER_IDS[course.slug];
    returnPath = `/courses/${course.slug}`;
  } else {
    amountCents = BUNDLE_PRICE_CENTS;
    offerId = BUNDLE_OFFER_ID;
    returnPath = '/bundle';
  }

  if (!offerId) {
    return NextResponse.json({ error: 'Для этого курса не настроена оплата' }, { status: 404 });
  }

  const user = await getOrCreateUser(email, name);

  const orderRef = `ord_${Date.now()}_${randomBytes(4).toString('hex')}`;
  const claimToken = randomBytes(24).toString('hex');
  const origin = new URL(request.url).origin;

  try {
    const payment = await createOfferPayment({
      offerId,
      orderRef,
      userId: user.id,
      email: user.email,
      notificationUrl: `${origin}/api/webhooks/getplatinum`,
      successUrl: `${origin}/order/success?order=${orderRef}&t=${claimToken}`,
      failUrl: `${origin}${returnPath}`,
    });

    // The charged amount comes from the GetPlatinum offer; never sell at a price different from the one on the site.
    if (payment.amountCents !== amountCents) {
      console.error(`Price mismatch for offer ${offerId}: site ${amountCents}, GetPlatinum ${payment.amountCents}`);
      return NextResponse.json({ error: 'Не удалось оформить заказ. Попробуйте позже.' }, { status: 502 });
    }

    // `prodamus_order_id` is a legacy column name — it holds our own order reference (sent as dealId).
    await sql`
      INSERT INTO orders (user_id, kind, course_id, prodamus_order_id, amount_cents, status, claim_token)
      VALUES (${user.id}, ${kind}, ${courseId}, ${orderRef}, ${amountCents}, 'pending', ${claimToken})
    `;
    return NextResponse.redirect(payment.url, { status: 303 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Не удалось создать ссылку на оплату. Попробуйте позже.' }, { status: 502 });
  }
}
