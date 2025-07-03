import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This middleware is now a simple pass-through.
// All authentication and session-related checks have been removed to prevent development server issues.
export function middleware(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
};
