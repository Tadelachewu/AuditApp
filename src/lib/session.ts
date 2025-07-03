import 'server-only';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import type { User } from '@prisma/client';
import prisma from './db';

const secretKey = process.env.SESSION_SECRET || 'fallback-secret-key-for-development';
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: any) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1d') // Session expires in 1 day
    .sign(key);
}

export async function decrypt(session: string | undefined = '') {
  try {
    const { payload } = await jwtVerify(session, key, {
      algorithms: ['HS256'],
    });
    return payload;
  } catch (error) {
    // This will be triggered for invalid or expired tokens
    return null;
  }
}

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
