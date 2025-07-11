import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { checkRateLimit, getIpFromRequest } from '@/lib/rate-limit';
import { config as appConfig } from '@/lib/config';

/**
 * Middleware following Next.js best practices
 * 
 * handles:
 * - Rate limiting for API routes
 * - Optimistic auth checks using cookies (no database calls)
 * - Basic redirects for auth pages
 * 
 * All secure auth checks are handled by the Data Access Layer (DAL)
 * in Server Components, API routes, and Server Actions.
 */
export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Define route categories
  const routeConfig = {
    isAuthPage: pathname.startsWith(appConfig.auth.paths.signIn) || pathname.startsWith(appConfig.auth.paths.signUp),
    isAuthCallback: pathname.startsWith(appConfig.auth.paths.callback),
    isProtectedRoute: pathname.startsWith('/app'),
    isPublicApiRoute: pathname.startsWith('/api/health') || pathname.startsWith('/api/stripe/webhook'),
    isApiRoute: pathname.startsWith('/api/'),
  };

  // 1. Rate limiting for API routes (except public webhooks)
  if (routeConfig.isApiRoute && !routeConfig.isPublicApiRoute) {
    const ip = getIpFromRequest(request);
    const rateLimitResult = checkRateLimit(ip);
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { 
          error: 'Rate limit exceeded. Please slow down your requests.',
          limit: rateLimitResult.limit,
          remaining: rateLimitResult.remaining,
          resetTime: rateLimitResult.resetTime
        },
        { status: 429 }
      );
    }
  }

  // 2. Skip auth for public routes and auth callback
  if (routeConfig.isAuthCallback || routeConfig.isPublicApiRoute) {
    return NextResponse.next();
  }

  // 3. Optimistic authentication check (cookie-based only)
  const authResult = await getOptimisticAuth(request);
  
  // 4. Handle protected routes - optimistic redirect only
  // Actual access checks happen in Server Components via DAL
  if (routeConfig.isProtectedRoute && !authResult.hasSession) {
    const signInUrl = new URL(appConfig.auth.paths.signIn, request.url);
    signInUrl.searchParams.set('redirect', pathname.slice(1));
    return NextResponse.redirect(signInUrl);
  }

  // 5. Handle API routes - optimistic check only
  // Actual verification happens in API route handlers via DAL
  if (routeConfig.isApiRoute && !authResult.hasSession) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }

  // 6. Redirect authenticated users away from auth pages
  if (routeConfig.isAuthPage && authResult.hasSession) {
    const redirectUrl = request.nextUrl.searchParams.get('redirect');
    const destination = redirectUrl ? `/${redirectUrl}` : appConfig.auth.paths.afterSignIn;
    return NextResponse.redirect(new URL(destination, request.url));
  }

  // Add pathname to headers for server components
  const response = authResult.response;
  response.headers.set('x-pathname', pathname);
  
  return response;
}

/**
 * Optimistic authentication check using only session cookies
 * 
 * This is a fast, lightweight check that:
 * - Only reads from cookies (no database calls)
 * - Verifies the session token format
 * - Does NOT verify payment status or detailed user data
 * 
 * For secure checks, use the DAL functions in your components/API routes.
 */
async function getOptimisticAuth(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });
  
  const supabase = createServerClient(
    appConfig.supabase.supabaseUrl,
    appConfig.supabase.supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  try {
    // Only check if user has a valid session (no database queries)
    const { data: { user }, error } = await supabase.auth.getUser();
    
    const hasSession = !error && !!user;
    
    return { 
      hasSession,
      userId: user?.id || null,
      response: supabaseResponse 
    };
  } catch (error) {
    console.error('Optimistic auth check error:', error);
    return { 
      hasSession: false, 
      userId: null, 
      response: supabaseResponse 
    };
  }
}

// Configure which routes this middleware runs on
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
