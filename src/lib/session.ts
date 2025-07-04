import 'server-only';
import { cache } from 'react';
import { cookies } from 'next/headers';
import { encrypt, decrypt } from './session-crypto';
import type { User as PrismaUser } from '@prisma/client';
import type { User } from './definitions';

export const getSession = cache(async (): Promise<User | null> => {
  const sessionCookie = cookies().get('session')?.value;
  if (!sessionCookie) return null;
  
  const session = await decrypt(sessionCookie);
  
  return session;
});

export async function createSession(user: PrismaUser) {
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day from now
  
  const { password, ...userWithoutPassword } = user;
  
  const session = await encrypt({ user: userWithoutPassword, expires });

  cookies().set('session', session, {
    expires,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  });
}

export async function deleteSession() {
  cookies().delete('session');
}
