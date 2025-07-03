import 'server-only';
import { SignJWT, jwtVerify } from 'jose';
import type { User as PrismaUser } from '@prisma/client';

// This function retrieves the secret key and ensures it's available.
function getSecretKey() {
  const secretKey = process.env.SESSION_SECRET;
  if (!secretKey) {
    throw new Error('SESSION_SECRET environment variable is not set. Please create or check your .env file.');
  }
  return new TextEncoder().encode(secretKey);
}

// This function takes a user object (without password) and signs a JWT.
export async function encrypt(payload: { user: Omit<PrismaUser, 'password'>, expires: Date }) {
  const key = getSecretKey();
  return new SignJWT({ ...payload.user })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(payload.expires)
    .sign(key);
}

// This function verifies a JWT and returns the user object from its payload.
export async function decrypt(input: string): Promise<Omit<PrismaUser, 'password'> | null> {
  try {
    const key = getSecretKey();
    const { payload } = await jwtVerify(input, key, {
      algorithms: ['HS256'],
    });
    // The payload contains the user fields plus iat, exp etc.
    // We can cast it back to the user type.
    const { iat, exp, ...user } = payload;
    return user as Omit<PrismaUser, 'password'>;
  } catch (error: any) {
    // These errors are expected during normal operation (e.g., expired token)
    // so we don't need to log them.
    if (error.code !== 'ERR_JWS_INVALID' && error.code !== 'ERR_JWT_EXPIRED' && error.code !== 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED') {
        console.error('Session decryption error:', error);
    }
    return null;
  }
}
