import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getApiUrl } from './lib/config';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Strict check: Only intercept paths starting with /admin
  const isAdminRoute = pathname.startsWith('/admin') && pathname !== '/admin/login';
  const isLoginRoute = pathname === '/admin/login';

  // If it's not an admin route or login route, completely bypass proxy
  if (!isAdminRoute && !isLoginRoute) {
    return NextResponse.next();
  }

  const cookieHeader = request.headers.get('cookie') || '';
  console.log(`[Proxy] Path: ${pathname}, Cookies length: ${cookieHeader.length}`);

  // If no cookies are present at all
  if (!cookieHeader) {
    console.log(`[Proxy] No cookies present. isAdminRoute: ${isAdminRoute}`);
    if (isAdminRoute) {
      console.log(`[Proxy] Redirecting unauthenticated user from ${pathname} to /admin/login`);
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // Check auth status and role with backend API /auth/me
  let isAdmin = false;
  try {
    const apiUrl = getApiUrl('/auth/me');
    console.log(`[Proxy] Fetching auth status from: ${apiUrl}`);
    const res = await fetch(apiUrl, {
      headers: {
        cookie: cookieHeader,
      },
      cache: 'no-store',
    });

    console.log(`[Proxy] Response status: ${res.status} (${res.statusText})`);

    if (res.ok) {
      const data = await res.json();
      console.log(`[Proxy] Response body:`, JSON.stringify(data));
      if (data && data.success && data.data) {
        isAdmin = true;
      } else {
        console.log(`[Proxy] Access denied: success=${data?.success}, hasData=${!!data?.data}`);
      }
    } else {
      const text = await res.text().catch(() => '');
      console.log(`[Proxy] Response not OK. Body: ${text}`);
    }
  } catch (error: any) {
    console.error(`[Proxy] Fetch failed:`, error?.message || error);
    isAdmin = false;
  }

  console.log(`[Proxy] Evaluation - Path: ${pathname}, isAdmin: ${isAdmin}, isAdminRoute: ${isAdminRoute}, isLoginRoute: ${isLoginRoute}`);

  // Redirect non-admin/unauthenticated user trying to access admin routes -> /admin/login
  if (isAdminRoute && !isAdmin) {
    console.log(`[Proxy] Redirecting non-admin/unauthenticated from ${pathname} to /admin/login`);
    const loginUrl = new URL('/admin/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated admin trying to access login page -> /admin/dashboard
  if (isLoginRoute && isAdmin) {
    console.log(`[Proxy] Redirecting authenticated admin to /admin/dashboard`);
    const dashboardUrl = new URL('/admin/dashboard', request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  console.log(`[Proxy] Bypassing proxy for ${pathname}`);
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
