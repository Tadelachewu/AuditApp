import 'server-only';
import type { User, Role } from '@prisma/client';

/**
 * NOTE: This function is currently mocked for development to prevent a bug
 * in the Next.js development server that causes an infinite refresh loop.
 * 
 * It returns a hardcoded user. You can switch the role to see how the UI
 * changes based on user permissions.
 * 
 * TO TEST AS A SPECIFIC ROLE:
 * 1. Comment out the other two mocked user blocks.
 * 2. Ensure only one `mockUser` definition is active.
 * 
 * The app will then behave as if that role is logged in.
 */
export async function getSession(): Promise<User> {
  // --- MOCK AUDITOR USER (default role) ---
  const mockUser: User = {
    id: 'clxmogjof0001108jabcde123', // A stable fake CUID for auditor
    name: 'Auditor User',
    email: 'auditor@xbank.com',
    password: '', // Not needed for mock
    role: 'AUDITOR' as Role,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // --- MOCK ADMIN USER (uncomment to use for testing) ---
  /*
  const mockUser: User = {
    id: 'clxmogjof0000108j9f4x5b6c', // A stable fake CUID for admin
    name: 'Admin User',
    email: 'admin@xbank.com',
    password: '', // Not needed for mock
    role: 'ADMIN' as Role,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  */

  // --- MOCK MANAGER USER (uncomment to use for testing) ---
  /*
  const mockUser: User = {
    id: 'clxmogjof0002108jefgh4567', // A stable fake CUID for manager
    name: 'Manager User',
    email: 'manager@xbank.com',
    password: '', // Not needed for mock
    role: 'MANAGER' as Role,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  */
  
  return mockUser;
}

// The original session creation/deletion logic is left here for future reference
// but is not currently used.

// import { cookies } from 'next/headers';
// import prisma from './db';
// import { encrypt, decrypt } from './session-crypto';

// export async function createSession(user: User) {
//   const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day from now
//   const session = await encrypt({ userId: user.id, role: user.role, expires });

//   cookies().set('session', session, {
//     expires,
//     httpOnly: true,
//     path: '/',
//   });
// }

// export async function deleteSession() {
//   cookies().delete('session');
// }
