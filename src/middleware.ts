import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decrypt } from '@/lib/session-crypto';
import { cookies } from 'next/headers';

const protectedRoutes = ['/', '/audits', '/checklists', '/documents', '/reports', '/risk-assessment', '/settings'];
const publicRoutes = ['/login', '/register'];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route));

  if (isProtectedRoute) {
    const sessionCookie = cookies().get('session')?.value;
    const session = await decrypt(sessionCookie || '');
    
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
};
