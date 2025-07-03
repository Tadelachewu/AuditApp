import 'server-only';
import { SignJWT, jwtVerify } from 'jose';
import type { User } from '@prisma/client';

// This function retrieves the secret key and ensures it's available.
// It's called within encrypt/decrypt to avoid top-level execution issues in the Edge runtime.
function getSecretKey() {
  const secretKey = process.env.SESSION_SECRET;
  if (!secretKey) {
    // This will now throw an error only when the functions are called without a secret,
    // not when the module is imported.
    throw new Error('SESSION_SECRET environment variable is not set. Please create or check your .env file.');
  }
  return new TextEncoder().encode(secretKey);
}

export async function encrypt(payload: { userId: string, role: User['role'], expires: Date }) {
  const key = getSecretKey();
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(payload.expires)
    .sign(key);
}

export async function decrypt(input: string): Promise<{ userId: string, role: User['role'] } | null> {
  try {
    const key = getSecretKey();
    const { payload } = await jwtVerify(input, key, {
      algorithms: ['HS256'],
    });
    return payload as { userId: string, role: User['role'] };
  } catch (error: any) {
    // Log errors for debugging, but don't crash the server.
    // Common errors are expired tokens (JWTExpired) or invalid signatures.
    if (error.code !== 'ERR_JWS_INVALID' && error.code !== 'ERR_JWT_EXPIRED') {
        console.error('Session decryption error:', error);
    }
    return null;
  }
}
