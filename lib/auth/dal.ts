import 'server-only';
import { createClient } from '@/lib/supabase/server';
import { config } from '@/lib/config';
import { redirect } from 'next/navigation';
import { cache } from 'react';
import type { User } from '@/lib/supabase/types';

/**
 * Data Access Layer (DAL) for Authentication & Authorization
 * 
 * This centralizes all auth checks and data access patterns.
 * Use these functions instead of directly calling Supabase in your components.
 * 
 * Benefits:
 * - Centralized auth logic
 * - Memoized results during React render pass
 * - Consistent error handling
 * - Security best practices
 */

/**
 * Verify the user's session and return user data
 * 
 * This is the core auth check function. It verifies the session
 * and returns user info if authenticated, or redirects if not.
 * 
 * Use this in Server Components, Server Actions, and API Routes
 * that require authentication.
 * 
 * @param redirectTo - Where to redirect if not authenticated (default: sign-in)
 * @returns User data from auth session
 */
export const verifySession = cache(async (redirectTo?: string) => {
  const supabase = await createClient();
  
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    const signInUrl = redirectTo || config.auth.paths.signIn;
    redirect(signInUrl);
  }
  
  return {
    isAuth: true,
    userId: user.id,
    email: user.email,
    user: user
  };
});

/**
 * Get the current authenticated user with database record
 * 
 * This function:
 * 1. Verifies the session (redirects if not authenticated)
 * 2. Fetches the user's database record
 * 3. Returns complete user data
 * 
 * Use this when you need both auth verification AND user data.
 * 
 * @param redirectTo - Where to redirect if not authenticated
 * @returns User data from database with auth info
 */
export const getUser = cache(async (redirectTo?: string) => {
  const session = await verifySession(redirectTo);
  
  try {
    const supabase = await createClient();
    
    const { data: dbUser, error } = await supabase
      .from('users')
      .select('*')
      .eq('supabase_user_id', session.userId)
      .single();
    
    if (error) {
       if (error.code === 'PGRST116') {
         // User doesn't exist in database yet - this can happen for new users
         // For now, redirect to sign-in - in production you might want a setup flow
         console.log('User not found in database:', session.userId);
         redirect(redirectTo || config.auth.paths.signIn);
       }
      
      console.error('Error fetching user from database:', error);
      throw new Error('Failed to fetch user data');
    }
    
    return {
      ...session,
      dbUser
    };
  } catch (error) {
    console.error('Error in getUser:', error);
    throw error;
  }
});

/**
 * Get user with access verification
 * 
 * This function:
 * 1. Verifies the session
 * 2. Fetches user data 
 * 3. Checks if user has paid access
 * 4. Redirects to payment page if no access
 * 
 * Use this for premium features that require payment.
 * 
 * @param redirectTo - Where to redirect if no access (default: home with access=required)
 * @returns User data with confirmed access
 */
export const getUserWithAccess = cache(async (redirectTo?: string) => {
  const userData = await getUser();
  
  if (!userData.dbUser.has_access) {
    const accessUrl = redirectTo || `/?access=required`;
    redirect(accessUrl);
  }
  
  return userData;
});

/**
 * Optional auth check - doesn't redirect
 * 
 * Use this when you want to conditionally show content
 * based on auth status without forcing authentication.
 * 
 * @returns User data if authenticated, null if not
 */
export const getOptionalUser = cache(async () => {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      return null;
    }
    
    // Also fetch database record if authenticated
    const { data: dbUser } = await supabase
      .from('users')
      .select('*')
      .eq('supabase_user_id', user.id)
      .single();
    
    return {
      isAuth: true,
      userId: user.id,
      email: user.email,
      user: user,
      dbUser
    };
  } catch (error) {
    console.error('Error in getOptionalUser:', error);
    return null;
  }
});

/**
 * Check if user has a specific role or permission
 * 
 * Extend this function as your authorization needs grow.
 * 
 * @param role - Role to check for
 * @returns Boolean indicating if user has the role
 */
export const userHasRole = cache(async (role: string) => {
  const userData = await getOptionalUser();
  
  if (!userData) return false;
  
  // Add your role checking logic here
  // For now, we'll just check basic access
  switch (role) {
    case 'user':
      return userData.dbUser?.has_access ?? false;
    case 'admin':
      // Add admin check logic here
      return false;
    default:
      return false;
  }
});

/**
 * Verify session for API routes
 * 
 * Use this in API routes instead of verifySession since
 * API routes should return JSON errors instead of redirecting.
 * 
 * @returns User session data or throws error
 */
export const verifyApiSession = cache(async () => {
  const supabase = await createClient();
  
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    throw new Error('Authentication required');
  }
  
  return {
    isAuth: true,
    userId: user.id,
    email: user.email,
    user: user
  };
});

/**
 * Get user for API routes with database record
 * 
 * @returns Complete user data or throws error
 */
export const getApiUser = cache(async () => {
  const session = await verifyApiSession();
  
  const supabase = await createClient();
  
  const { data: dbUser, error } = await supabase
    .from('users')
    .select('*')
    .eq('supabase_user_id', session.userId)
    .single();
  
  if (error) {
    console.error('Error fetching user from database:', error);
    throw new Error('Failed to fetch user data');
  }
  
  return {
    ...session,
    dbUser
  };
});

/**
 * Get user purchases for API routes
 * 
 * @returns Array of purchases for the authenticated user
 */
export const getUserPurchases = cache(async () => {
  const userData = await getApiUser();
  
  const supabase = await createClient();
  
  const { data: purchases, error } = await supabase
    .from('purchases')
    .select('*')
    .eq('user_id', userData.dbUser.id)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching user purchases:', error);
    throw new Error('Failed to fetch purchases');
  }
  
  return purchases || [];
}); 