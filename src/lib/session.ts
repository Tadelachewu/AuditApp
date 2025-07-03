import 'server-only';
import { cookies } from 'next/headers';
import type { User } from '@prisma/client';
import prisma from './db';
import { encrypt, decrypt } from './session-crypto';

export async function createSession(user: User) {
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day from now
  const session = await encrypt({ userId: user.id, role: user.role, expires });

  cookies().set('session', session, {
    expires,
    httpOnly: true,
    path: '/',
  });
}

export async function deleteSession() {
  cookies().delete('session');
}

export async function getSession(): Promise<User | null> {
    const sessionCookie = cookies().get('session')?.value;
    const payload = await decrypt(sessionCookie);

    if (!payload?.userId) {
        return null;
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: payload.userId as string },
        });

        if (!user) {
            return null;
        }

        // Return the user object without the password hash
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;

    } catch (error) {
        console.error("Failed to fetch user for session:", error);
        return null;
    }
}
