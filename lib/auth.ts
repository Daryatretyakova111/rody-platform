import { randomBytes } from 'node:crypto';
import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';
import { sql } from '@/lib/db';

const SESSION_COOKIE = 'session';
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30; // 30 days
const LOGIN_TOKEN_TTL_MINUTES = 30;

function getJwtSecret(): Uint8Array {
  const secret = process.env.AUTH_JWT_SECRET;
  if (!secret) {
    throw new Error('AUTH_JWT_SECRET environment variable is not set');
  }
  return new TextEncoder().encode(secret);
}

export async function createLoginToken(userId: number): Promise<string> {
  const token = randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + LOGIN_TOKEN_TTL_MINUTES * 60 * 1000);
  await sql`
    INSERT INTO login_tokens (token, user_id, expires_at)
    VALUES (${token}, ${userId}, ${expiresAt.toISOString()})
  `;
  return token;
}

export async function consumeLoginToken(token: string): Promise<number | null> {
  const rows = (await sql`
    SELECT user_id, expires_at, used_at FROM login_tokens WHERE token = ${token}
  `) as { user_id: number; expires_at: string; used_at: string | null }[];

  const row = rows[0];
  if (!row || row.used_at || new Date(row.expires_at) < new Date()) {
    return null;
  }

  await sql`UPDATE login_tokens SET used_at = now() WHERE token = ${token}`;
  return row.user_id;
}

export async function setSessionCookie(userId: number): Promise<void> {
  const jwt = await new SignJWT({ userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .sign(getJwtSecret());

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, jwt, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_TTL_SECONDS,
  });
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function getSessionUserId(): Promise<number | null> {
  const cookieStore = await cookies();
  const jwt = cookieStore.get(SESSION_COOKIE)?.value;
  if (!jwt) return null;

  try {
    const { payload } = await jwtVerify(jwt, getJwtSecret());
    return typeof payload.userId === 'number' ? payload.userId : null;
  } catch {
    return null;
  }
}
