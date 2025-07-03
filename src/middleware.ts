import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decrypt } from '@/lib/session-crypto';
import { cookies } from 'next/headers';

const protectedRoutes = ['/', '/audits', '/checklists', '/documents', '/reports', '/risk-assessment', '/settings'];
const publicRoutes = ['/login', '/register'];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route));
  const isPublicRoute = publicRoutes.includes(path);

  // Try to get the session from the cookies.
  const sessionCookie = cookies().get('session')?.value;
  const session = sessionCookie ? await decrypt(sessionCookie) : null;

  // If the user is trying to access a protected route without a valid session,
  // redirect them to the login page.
  if (isProtectedRoute && !session?.id) {
    return NextResponse.redirect(new URL('/login', request.nextUrl));
  }

  // If the user is logged in and tries to access a public route like login
  // or register, redirect them to the dashboard.
  if (isPublicRoute && session?.id) {
    return NextResponse.redirect(new URL('/', request.nextUrl));
  }

  return NextResponse.next();
}

// This config ensures the middleware runs on all paths except for static files
// and API routes.
export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
};
