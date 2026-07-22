import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Strict check: Only intercept paths starting with /admin
  const isAdminRoute = pathname.startsWith('/admin') && pathname !== '/admin/login';
  const isLoginRoute = pathname === '/admin/login';

  // If it's not an admin route or login route, completely bypass middleware
  if (!isAdminRoute && !isLoginRoute) {
    return NextResponse.next();
  }

  const cookieHeader = request.headers.get('cookie') || '';

  // If no cookies are present at all
  if (!cookieHeader) {
    if (isAdminRoute) {
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // Check auth status with backend API /auth/me
  let isAuthenticated = false;
  try {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: {
        cookie: cookieHeader,
      },
      cache: 'no-store',
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.success && data.data) {
        isAuthenticated = true;
      }
    }
  } catch (error) {
    isAuthenticated = false;
  }

  // Redirect unauthenticated user trying to access admin routes -> /admin/login
  if (isAdminRoute && !isAuthenticated) {
    const loginUrl = new URL('/admin/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated user trying to access login page -> /admin/dashboard
  if (isLoginRoute && isAuthenticated) {
    const dashboardUrl = new URL('/admin/dashboard', request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
