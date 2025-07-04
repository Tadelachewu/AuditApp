import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSession } from '@/lib/session';

const protectedRoutes = [
  '/',
  '/audits',
  '/checklists',
  '/documents',
  '/reports',
  '/risk-assessment',
  '/settings',
];

const authRoutes = ['/login', '/register'];

export async function middleware(request: NextRequest) {
  const session = await getSession();
  const isProtectedRoute = protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route));
  const isAuthRoute = authRoutes.some(route => request.nextUrl.pathname.startsWith(route));

  if (!session && isProtectedRoute) {
    return NextResponse.redirect(new URL('/login', request.nextUrl));
  }

  if (session && isAuthRoute) {
    return NextResponse.redirect(new URL('/', request.nextUrl));
  }
  
  // Role-based restrictions
  if (session) {
    const { role } = session;
    const { pathname } = request.nextUrl;

    // Only ADMIN can access Risk Assessment
    if (pathname.startsWith('/risk-assessment') && role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/', request.nextUrl));
    }

    // Add other role-based route restrictions here if needed
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
