import { NextRequest, NextResponse } from 'next/server';
import { getUserByEmail } from '@/lib/queries';
import { createLoginToken } from '@/lib/auth';
import { sendMagicLinkEmail } from '@/lib/mail';

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  const origin = new URL(request.url).origin;

  if (email && email.includes('@')) {
    const user = await getUserByEmail(email);
    // Don't reveal whether the email exists — always redirect to the same "check your email" page.
    if (user) {
      const token = await createLoginToken(user.id);
      const loginUrl = `${origin}/api/auth/callback?token=${token}`;
      await sendMagicLinkEmail(user.email, loginUrl);
    }
  }

  return NextResponse.redirect(`${origin}/login?sent=1`, { status: 303 });
}
