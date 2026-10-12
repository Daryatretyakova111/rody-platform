import { NextRequest, NextResponse } from 'next/server';
import { getOrderByClaim } from '@/lib/queries';
import { setInitialPassword, setSessionCookie } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const orderRef = String(formData.get('order') ?? '');
  const token = String(formData.get('t') ?? '');
  const password = String(formData.get('password') ?? '');
  const password2 = String(formData.get('password2') ?? '');
  const origin = new URL(request.url).origin;
  const back = `${origin}/order/success?order=${encodeURIComponent(orderRef)}&t=${encodeURIComponent(token)}`;

  const order = await getOrderByClaim(orderRef, token);
  if (!order || order.status !== 'paid') {
    return NextResponse.redirect(`${origin}/first-login`, { status: 303 });
  }
  if (password.length < 6 || password !== password2) {
    return NextResponse.redirect(`${back}&error=1`, { status: 303 });
  }

  const saved = await setInitialPassword(order.user_id, password);
  if (!saved) {
    // The account already has a password (repeat buyer) — never overwrite it from a public link.
    return NextResponse.redirect(`${origin}/login`, { status: 303 });
  }

  await setSessionCookie(order.user_id);
  return NextResponse.redirect(`${origin}/cabinet`, { status: 303 });
}
