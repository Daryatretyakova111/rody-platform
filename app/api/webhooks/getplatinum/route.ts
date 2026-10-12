import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { isGetPlatinumConfigured, verifyChecksum } from '@/lib/getplatinum';

interface PaymentNotification {
  notificationType?: number;
  dealId?: string;
  isSuccess?: boolean;
}

interface OrderRow {
  id: number;
  user_id: number;
  course_id: number | null;
  status: string;
}

export async function POST(request: NextRequest) {
  if (!isGetPlatinumConfigured()) {
    return new NextResponse('Not configured', { status: 503 });
  }

  const rawBody = await request.text();
  if (!verifyChecksum(rawBody, request.headers.get('X-Checksum'))) {
    return new NextResponse('Invalid signature', { status: 401 });
  }

  let payload: PaymentNotification;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return new NextResponse('Bad request', { status: 400 });
  }

  // Only the regular payment result (type 1) matters here; other notification types are acknowledged and ignored.
  if (payload.notificationType !== 1 || !payload.isSuccess || !payload.dealId) {
    return new NextResponse('OK');
  }

  // `prodamus_order_id` is a legacy column name — it holds our own order reference sent as dealId.
  const rows = (await sql`
    SELECT id, user_id, course_id, status FROM orders WHERE prodamus_order_id = ${payload.dealId}
  `) as OrderRow[];
  const order = rows[0];

  if (!order) {
    return new NextResponse('Order not found', { status: 404 });
  }
  if (order.status === 'paid') {
    return new NextResponse('OK'); // retried notification, access was already granted
  }

  await sql`UPDATE orders SET status = 'paid', paid_at = now() WHERE id = ${order.id}`;
  await sql`
    INSERT INTO purchases (user_id, course_id, order_id)
    VALUES (${order.user_id}, ${order.course_id}, ${order.id})
  `;

  return new NextResponse('OK');
}
