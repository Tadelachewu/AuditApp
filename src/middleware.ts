import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decrypt } from '@/lib/session-crypto';
import type { User } from '@/lib/definitions';

const protectedRoutes = [
  '/audits',
  '/checklists',
  '/documents',
  '/reports',
  '/risk-assessment',
  '/settings',
];

const authRoutes = ['/login', '/register'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const sessionCookie = request.cookies.get('session')?.value;
  const session: User | null = sessionCookie ? await decrypt(sessionCookie) : null;
  
  // The root path '/' is a protected route, handled separately.
  const isProtectedRoute = pathname === '/' || protectedRoutes.some(route => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));

  if (!session && isProtectedRoute) {
    return NextResponse.redirect(new URL('/login', request.nextUrl));
  }

  if (session && isAuthRoute) {
    return NextResponse.redirect(new URL('/', request.nextUrl));
  }
  
  // Role-based restrictions
  if (session) {
    const { role } = session;

    // Only ADMIN can access Risk Assessment
    if (pathname.startsWith('/risk-assessment') && role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/', request.nextUrl));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
