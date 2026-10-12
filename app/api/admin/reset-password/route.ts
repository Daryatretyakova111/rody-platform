import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getSessionUserId, isAdmin } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const userId = await getSessionUserId();
  if (!userId || !(await isAdmin(userId))) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  const formData = await request.formData();
  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  const origin = new URL(request.url).origin;

  const rows = (await sql`
    UPDATE users SET password_hash = NULL WHERE email = ${email} RETURNING id
  `) as unknown[];

  const result = rows.length > 0 ? 'ok' : 'notfound';
  return NextResponse.redirect(`${origin}/admin?result=${result}&email=${encodeURIComponent(email)}`, { status: 303 });
}
