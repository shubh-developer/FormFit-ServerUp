import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verify } from 'jsonwebtoken';
import { SessionManager } from '@/lib/session';

// Admin routes that require authentication
const protectedAdminRoutes = [
  '/dashboard', // Main admin dashboard
  '/admin',
  '/admin/dashboard',
  '/admin/bookings',
  '/admin/inquiries',
  '/admin/feedback',
  '/admin/settings',
];

// Public admin routes
const publicAdminRoutes = [
  '/admin/login',
];

// Client routes that require authentication
const protectedClientRoutes = [
  '/profile',
  '/dashboard',
];

// Public client routes
const publicClientRoutes = [
  '/login',
  '/register',
];

function verifyAdminToken(token: string): boolean {
  try {
    const jwtSecret = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production-min-32-chars';
    const decoded = verify(token, jwtSecret) as { role: string; exp: number };
    
    // Check if token is expired
    if (decoded.exp < Math.floor(Date.now() / 1000)) {
      return false;
    }
    
    // Check if user has admin role
    if (decoded.role !== 'admin') {
      return false;
    }
    
    return true;
  } catch {
    return false;
  }
}


export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Early return for master routes
  if (pathname.startsWith('/master-')) {
    return NextResponse.next();
  }

  // Handle admin routes
  if (pathname.startsWith('/admin')) {
    // Allow public admin routes
    if (publicAdminRoutes.includes(pathname)) {
      return NextResponse.next();
    }

    // Check if it's a protected admin route
    const isProtectedRoute = protectedAdminRoutes.some(route => 
      pathname.startsWith(route)
    );

    if (!isProtectedRoute) {
      return NextResponse.next();
    }

    // Check session first
    if (!SessionManager.validateSession(request, 'admin')) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Fallback to token-based auth for API calls
    let adminToken = request.cookies.get('adminToken')?.value;
    
    if (!adminToken) {
      const authHeader = request.headers.get('authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        adminToken = authHeader.substring(7);
      }
    }

    // If no token and no valid session, redirect to login
    if (!adminToken) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Verify token
    if (!verifyAdminToken(adminToken)) {
      // Clear invalid token cookie and session
      const response = NextResponse.redirect(new URL('/admin/login', request.url));
      response.cookies.delete('adminToken');
      const sessionId = SessionManager.getSessionId(request, 'admin');
      if (sessionId) {
        SessionManager.removeSession(sessionId);
      }
      return response;
    }

    // Token is valid, allow access
    return NextResponse.next();
  }

  // Handle client routes
  if (pathname.startsWith('/profile') || pathname === '/login' || pathname === '/register') {
    // Allow public client routes
    if (publicClientRoutes.includes(pathname)) {
      return NextResponse.next();
    }

    // Check if it's a protected client route
    const isProtectedRoute = protectedClientRoutes.some(route => 
      pathname.startsWith(route)
    );

    if (!isProtectedRoute) {
      return NextResponse.next();
    }

    // Check if client session is valid
    const sessionValid = SessionManager.validateSession(request, 'client');
    console.log(`[MIDDLEWARE] Client session validation for ${pathname}:`, sessionValid);
    
    if (!sessionValid) {
      console.log(`[MIDDLEWARE] Redirecting to login from ${pathname}`);
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Token is valid, allow access
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/profile/:path*',
    '/dashboard/:path*',
    '/login',
    '/register'
  ],
}; 