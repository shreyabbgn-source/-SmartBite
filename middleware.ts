import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;

  // Define protected routes
  const isStaffRoute = path.startsWith('/staff') && !path.startsWith('/staff/login');
  const isAdminRoute = path.startsWith('/admin') && !path.startsWith('/admin/login');

  // For staff and admin routes, we'll handle protection on the client side
  // since we're using client-side state management with Zustand
  // This middleware is mainly for future server-side session handling

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/staff/:path*',
    '/admin/:path*',
  ],
};
