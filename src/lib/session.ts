import 'server-only';
import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';
import type { User as PrismaUser } from '@prisma/client';
import { cache } from 'react';

function getSecretKey() {
  const secretKey = process.env.SESSION_SECRET;
  if (!secretKey) {
    throw new Error('FATAL: SESSION_SECRET environment variable is not set.');
  }
  return new TextEncoder().encode(secretKey);
}

async function encrypt(payload: { user: Omit<PrismaUser, 'password'>, expires: Date }) {
  const key = getSecretKey();
  return new SignJWT({ ...payload.user })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(payload.expires)
    .sign(key);
}

async function decrypt(input: string): Promise<Omit<PrismaUser, 'password'> | null> {
  try {
    const key = getSecretKey();
    const { payload } = await jwtVerify(input, key, {
      algorithms: ['HS256'],
    });
    const { iat, exp, ...user } = payload;
    return user as Omit<PrismaUser, 'password'>;
  } catch (error) {
    return null;
  }
}

export async function createSession(user: Omit<PrismaUser, 'password'>) {
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day
  const session = await encrypt({ user, expires });
  cookies().set('session', session, { expires, httpOnly: true });
}

export async function deleteSession() {
  cookies().delete('session');
}

export const getSession = cache(async () => {
  const sessionCookie = cookies().get('session')?.value;
  if (!sessionCookie) {
    return null;
  }
  return await decrypt(sessionCookie);
});
