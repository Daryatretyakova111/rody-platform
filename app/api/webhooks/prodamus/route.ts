import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getUserById } from '@/lib/queries';
import { verifyWebhookSignature } from '@/lib/prodamus';
import { createLoginToken } from '@/lib/auth';
import { sendMagicLinkEmail } from '@/lib/mail';

interface OrderRow {
  id: number;
  user_id: number;
  course_id: number | null;
  status: string;
}

export async function POST(request: NextRequest) {
  const contentType = request.headers.get('content-type') ?? '';
  let payload: Record<string, unknown>;

  if (contentType.includes('application/json')) {
    payload = await request.json();
  } else {
    const formData = await request.formData();
    payload = Object.fromEntries(formData.entries());
  }

  const signature = (payload.signature as string) ?? request.headers.get('sign');
  if (!verifyWebhookSignature(payload, signature)) {
    return new NextResponse('Invalid signature', { status: 400 });
  }

  const orderId = String(payload.order_id ?? '');
  const paymentStatus = String(payload.payment_status ?? '');

  const rows = (await sql`
    SELECT id, user_id, course_id, status FROM orders WHERE prodamus_order_id = ${orderId}
  `) as OrderRow[];
  const order = rows[0];

  if (!order) {
    return new NextResponse('Order not found', { status: 404 });
  }

  if (order.status === 'paid') {
    return new NextResponse('OK'); // already processed, avoid double-granting on retried webhooks
  }

  if (paymentStatus !== 'success') {
    await sql`UPDATE orders SET status = 'failed' WHERE id = ${order.id}`;
    return new NextResponse('OK');
  }

  await sql`UPDATE orders SET status = 'paid', paid_at = now() WHERE id = ${order.id}`;
  await sql`
    INSERT INTO purchases (user_id, course_id, order_id)
    VALUES (${order.user_id}, ${order.course_id}, ${order.id})
  `;

  const user = await getUserById(order.user_id);
  if (user) {
    const token = await createLoginToken(user.id);
    const origin = new URL(request.url).origin;
    const loginUrl = `${origin}/api/auth/callback?token=${token}`;
    await sendMagicLinkEmail(user.email, loginUrl);
  }

  return new NextResponse('OK');
}
