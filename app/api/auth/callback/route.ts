import { NextRequest, NextResponse } from 'next/server';
import { consumeLoginToken, setSessionCookie } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token');
  const origin = new URL(request.url).origin;

  if (!token) {
    return NextResponse.redirect(`${origin}/login?error=1`);
  }

  const userId = await consumeLoginToken(token);
  if (!userId) {
    return NextResponse.redirect(`${origin}/login?error=1`);
  }

  await setSessionCookie(userId);
  return NextResponse.redirect(`${origin}/cabinet`);
}
