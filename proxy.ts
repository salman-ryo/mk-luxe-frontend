import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getApiUrl } from './lib/config';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminRoute = pathname.startsWith('/admin') && pathname !== '/admin/login';
  const isLoginRoute = pathname === '/admin/login';

  if (!isAdminRoute && !isLoginRoute) {
    return NextResponse.next();
  }

  // 1. USE NEXT.JS COOKIE API TO CHECK FOR SPECIFIC AUTH COOKIES
  const accessToken = request.cookies.get('access_token')?.value;
  const refreshToken = request.cookies.get('refresh_token')?.value;
  const hasAuthTokens = !!(accessToken || refreshToken);

  console.log(`[Proxy] Path: ${pathname}, hasAuthTokens: ${hasAuthTokens}`);

  // 2. CHECK SPECIFIC TOKENS, NOT JUST ANY COOKIE
  if (!hasAuthTokens) {
    console.log(`[Proxy] No auth cookies present. isAdminRoute: ${isAdminRoute}`);
    if (isAdminRoute) {
      console.log(`[Proxy] Redirecting unauthenticated user from ${pathname} to /admin/login`);
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // 3. GRAB RAW HEADER TO FORWARD TO BACKEND
  const cookieHeader = request.headers.get('cookie') || '';
  let isAdmin = false;

  try {
    const apiUrl = getApiUrl('/auth/me');
    console.log(`[Proxy] Fetching auth status from: ${apiUrl}`);

    const res = await fetch(apiUrl, {
      headers: {
        cookie: cookieHeader, // Forward all cookies to Go backend
      },
      // Note: credentials: 'include' is technically ignored by Node/Edge fetch 
      // when you are manually passing the cookie header, but it is harmless to leave.
      cache: 'no-store',
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.success && data.data) {
        isAdmin = true;
      }
    }
  } catch (error: any) {
    console.error(`[Proxy] Fetch failed:`, error?.message || error);
    isAdmin = false;
  }

  if (isAdminRoute && !isAdmin) {
    console.log(`[Proxy] Redirecting non-admin/unauthenticated from ${pathname} to /admin/login`);
    const loginUrl = new URL('/admin/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (isLoginRoute && isAdmin) {
    console.log(`[Proxy] Redirecting authenticated admin to /admin/dashboard`);
    const dashboardUrl = new URL('/admin/dashboard', request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};