import { NextRequest, NextResponse } from 'next/server';
import { clearSessionCookie } from '@/lib/auth';

export async function POST(request: NextRequest) {
  await clearSessionCookie();
  const origin = new URL(request.url).origin;
  return NextResponse.redirect(`${origin}/`, { status: 303 });
}
