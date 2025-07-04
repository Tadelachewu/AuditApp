import 'server-only';
import { cookies } from 'next/headers';
import type { User } from './definitions';
import { cache } from 'react';

// This function has been removed as it was causing persistent errors with Next.js dynamic rendering.
// The logic is now handled directly inside each page component.

export async function createSession(user: Omit<User, 'createdAt' | 'updatedAt'>) {
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day from now
  
  const { password, ...userWithoutPassword } = user;
  
  // This needs to be re-imported as it is not available in the global scope
  const { encrypt } = await import('./session-crypto');
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
