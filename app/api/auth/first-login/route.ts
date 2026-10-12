import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { setInitialPassword, setSessionCookie } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  const password = String(formData.get('password') ?? '');
  const password2 = String(formData.get('password2') ?? '');
  const origin = new URL(request.url).origin;
  const fail = NextResponse.redirect(`${origin}/first-login?error=1`, { status: 303 });

  if (!email || password.length < 6 || password !== password2) return fail;

  // Only accounts that have actually paid for something and don't have a password yet can use this.
  const rows = (await sql`
    SELECT u.id FROM users u
    WHERE u.email = ${email}
      AND u.password_hash IS NULL
      AND EXISTS (SELECT 1 FROM purchases p WHERE p.user_id = u.id)
  `) as { id: number }[];
  const user = rows[0];
  if (!user) return fail;

  const saved = await setInitialPassword(user.id, password);
  if (!saved) return fail;

  await setSessionCookie(user.id);
  return NextResponse.redirect(`${origin}/cabinet`, { status: 303 });
}
