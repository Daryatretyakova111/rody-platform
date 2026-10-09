import { config } from 'dotenv';
config({ path: '.env.local' });
import { randomBytes } from 'node:crypto';
import { neon } from '@neondatabase/serverless';
import { BUNDLE_PRICE_CENTS } from '../lib/config';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const sql = neon(process.env.DATABASE_URL);

// Confirms a payment received on GetPlatinum and opens the course in the buyer's cabinet.
//
// Usage: PAID_EMAIL=buyer@example.com PAID_PRODUCT=rody npm run mark-paid
// PAID_PRODUCT is a course slug (podgotovka-k-rodam, rody, vosstanovlenie) or "bundle".
async function main() {
  const email = process.env.PAID_EMAIL?.trim().toLowerCase();
  const product = process.env.PAID_PRODUCT?.trim();
  if (!email || !product) {
    throw new Error('Set PAID_EMAIL and PAID_PRODUCT (course slug or "bundle").');
  }

  const [user] = (await sql`SELECT id FROM users WHERE email = ${email}`) as { id: number }[];
  if (!user) {
    throw new Error(`No account for ${email} — the buyer has to submit the checkout form first.`);
  }

  const isBundle = product === 'bundle';
  let courseId: number | null = null;
  let amountCents = BUNDLE_PRICE_CENTS;

  if (!isBundle) {
    const [course] = (await sql`SELECT id, price_cents FROM courses WHERE slug = ${product}`) as {
      id: number;
      price_cents: number;
    }[];
    if (!course) throw new Error(`Unknown course slug: ${product}`);
    courseId = course.id;
    amountCents = course.price_cents;
  }

  const alreadyOwned = (
    isBundle
      ? await sql`SELECT 1 FROM purchases WHERE user_id = ${user.id} AND course_id IS NULL LIMIT 1`
      : await sql`SELECT 1 FROM purchases WHERE user_id = ${user.id} AND course_id = ${courseId} LIMIT 1`
  ) as unknown[];
  if (alreadyOwned.length > 0) {
    console.log(`${email} already has access to ${product} — nothing to do.`);
    return;
  }

  const pending = (
    isBundle
      ? await sql`
          SELECT id FROM orders
          WHERE user_id = ${user.id} AND kind = 'bundle' AND status = 'pending'
          ORDER BY id DESC LIMIT 1`
      : await sql`
          SELECT id FROM orders
          WHERE user_id = ${user.id} AND kind = 'course' AND course_id = ${courseId} AND status = 'pending'
          ORDER BY id DESC LIMIT 1`
  ) as { id: number }[];

  let orderId: number;
  if (pending[0]) {
    orderId = pending[0].id;
    await sql`UPDATE orders SET status = 'paid', paid_at = now() WHERE id = ${orderId}`;
  } else {
    const orderRef = `manual_${Date.now()}_${randomBytes(4).toString('hex')}`;
    const [order] = (await sql`
      INSERT INTO orders (user_id, kind, course_id, prodamus_order_id, amount_cents, status, paid_at)
      VALUES (${user.id}, ${isBundle ? 'bundle' : 'course'}, ${courseId}, ${orderRef}, ${amountCents}, 'paid', now())
      RETURNING id
    `) as { id: number }[];
    orderId = order.id;
  }

  const existing = (await sql`SELECT 1 FROM purchases WHERE order_id = ${orderId}`) as unknown[];
  if (existing.length === 0) {
    await sql`
      INSERT INTO purchases (user_id, course_id, order_id)
      VALUES (${user.id}, ${courseId}, ${orderId})
    `;
  }

  console.log(`Access granted: ${email} → ${product}.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
