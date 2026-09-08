import { config } from 'dotenv';
config({ path: '.env.local' });
import { randomBytes } from 'node:crypto';
import { hash } from 'bcryptjs';
import { neon } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const sql = neon(process.env.DATABASE_URL);

// Grants a user full access to all courses (like a bundle purchase), and
// optionally sets a password for password-based login via /admin-login.
//
// Usage: GRANT_EMAIL=someone@example.com GRANT_PASSWORD=secret npm run grant-access
async function main() {
  const email = process.env.GRANT_EMAIL?.trim().toLowerCase();
  const password = process.env.GRANT_PASSWORD;

  if (!email) {
    throw new Error('Set GRANT_EMAIL (and optionally GRANT_PASSWORD) environment variables.');
  }

  const passwordHash = password ? await hash(password, 12) : null;

  const [user] = (await sql`
    INSERT INTO users (email, password_hash)
    VALUES (${email}, ${passwordHash})
    ON CONFLICT (email) DO UPDATE SET
      password_hash = COALESCE(EXCLUDED.password_hash, users.password_hash)
    RETURNING id
  `) as { id: number }[];

  const orderRef = `admin_${Date.now()}_${randomBytes(4).toString('hex')}`;
  const [order] = (await sql`
    INSERT INTO orders (user_id, kind, course_id, prodamus_order_id, amount_cents, status, paid_at)
    VALUES (${user.id}, 'bundle', NULL, ${orderRef}, 0, 'paid', now())
    RETURNING id
  `) as { id: number }[];

  await sql`
    INSERT INTO purchases (user_id, course_id, order_id)
    VALUES (${user.id}, NULL, ${order.id})
  `;

  console.log(`Granted full access to ${email}${passwordHash ? ' with a password set' : ''}.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
