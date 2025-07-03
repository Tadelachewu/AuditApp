import { NextResponse, type NextRequest } from 'next/server';
import { decrypt } from '@/lib/session-crypto';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow API routes and static files to pass through immediately
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next/static') ||
    pathname.startsWith('/_next/image') ||
    pathname.endsWith('.ico') ||
    pathname.endsWith('.png')
  ) {
    return NextResponse.next();
  }

  const sessionCookie = request.cookies.get('session')?.value;
  const sessionPayload = await decrypt(sessionCookie);
  const isLoggedIn = !!sessionPayload?.userId;

  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/register');

  // If trying to access an auth page while logged in, redirect to dashboard
  if (isLoggedIn && isAuthPage) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // If trying to access a protected page while not logged in, redirect to login
  if (!isLoggedIn && !isAuthPage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
};
