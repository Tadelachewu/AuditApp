import 'server-only';
import { cookies } from 'next/headers';
import prisma from './db';
import { encrypt, decrypt } from './session-crypto';
import type { User, Role } from '@prisma/client';
import { cache } from 'react';

export const getSession = cache(async (): Promise<User | null> => {
  const sessionCookie = cookies().get('session')?.value;
  if (!sessionCookie) return null;

  const decryptedSession = await decrypt(sessionCookie);
  if (!decryptedSession?.userId) return null;

  try {
    const user = await prisma.user.findUnique({
      where: { id: decryptedSession.userId },
    });
    
    if (!user) return null;

    // Return user object without the password hash
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;

  } catch (error) {
    console.error("Failed to fetch user for session:", error);
    return null;
  }
});

export async function createSession(user: User) {
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day from now
  const session = await encrypt({ userId: user.id, role: user.role, expires });

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
