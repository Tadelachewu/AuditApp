import 'server-only';
import { SignJWT, jwtVerify } from 'jose';
import type { User } from '@prisma/client';

const secretKey = process.env.SESSION_SECRET || 'fallback-secret-for-development';
if (secretKey === 'fallback-secret-for-development') {
    console.warn('Warning: Using fallback session secret. Set SESSION_SECRET in .env for production.');
}
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: { userId: string, role: User['role'], expires: Date }) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(payload.expires)
    .sign(key);
}

export async function decrypt(input: string): Promise<{ userId: string, role: User['role'] } | null> {
  try {
    const { payload } = await jwtVerify(input, key, {
      algorithms: ['HS256'],
    });
    return payload as { userId: string, role: User['role'] };
  } catch (error) {
    // This will handle expired tokens or invalid signatures
    console.error('Session decryption failed:', error);
    return null;
  }
}
