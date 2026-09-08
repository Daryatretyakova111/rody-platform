import { NextRequest, NextResponse } from 'next/server';
import { verifyPassword, setSessionCookie } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  const password = String(formData.get('password') ?? '');
  const origin = new URL(request.url).origin;

  const userId = await verifyPassword(email, password);
  if (!userId) {
    return NextResponse.redirect(`${origin}/admin-login?error=1`, { status: 303 });
  }

  await setSessionCookie(userId);
  return NextResponse.redirect(`${origin}/cabinet`, { status: 303 });
}
