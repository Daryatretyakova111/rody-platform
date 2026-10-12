import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';
import { compare, hash } from 'bcryptjs';
import { sql } from '@/lib/db';

const SESSION_COOKIE = 'session';
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30; // 30 days

function getJwtSecret(): Uint8Array {
  const secret = process.env.AUTH_JWT_SECRET;
  if (!secret) {
    throw new Error('AUTH_JWT_SECRET environment variable is not set');
  }
  return new TextEncoder().encode(secret);
}

export async function verifyPassword(email: string, password: string): Promise<number | null> {
  const rows = (await sql`
    SELECT id, password_hash FROM users WHERE email = ${email}
  `) as { id: number; password_hash: string | null }[];

  const user = rows[0];
  if (!user || !user.password_hash) return null;

  const valid = await compare(password, user.password_hash);
  return valid ? user.id : null;
}

/** Sets a password only for an account that has none yet; returns false if it already has one. */
export async function setInitialPassword(userId: number, password: string): Promise<boolean> {
  const passwordHash = await hash(password, 12);
  const rows = (await sql`
    UPDATE users SET password_hash = ${passwordHash}
    WHERE id = ${userId} AND password_hash IS NULL
    RETURNING id
  `) as unknown[];
  return rows.length > 0;
}

export async function isAdmin(userId: number): Promise<boolean> {
  const rows = (await sql`SELECT is_admin FROM users WHERE id = ${userId}`) as { is_admin: boolean }[];
  return rows[0]?.is_admin === true;
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
