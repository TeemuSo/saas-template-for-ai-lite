'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';
import { User as DbUser } from '@/lib/supabase/types';
import { z } from 'zod';
import { config } from '@/lib/config';

// Password validation regex patterns
const passwordPatterns = {
  uppercase: /[A-Z]/,
  lowercase: /[a-z]/,
  number: /[0-9]/,
  special: /[!@#$%^&*(),.?":{}|<>]/,
};

// Validation schemas
const signInSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

// Enhanced password validation for signup
const signUpSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string()
    .min(config.auth.passwordMinLength, `Password must be at least ${config.auth.passwordMinLength} characters`)
    .refine(
      (password) => {
        // Check all password requirements
        if (config.auth.passwordRequireUppercase && !passwordPatterns.uppercase.test(password)) {
          return false;
        }
        if (config.auth.passwordRequireLowercase && !passwordPatterns.lowercase.test(password)) {
          return false;
        }
        if (config.auth.passwordRequireNumbers && !passwordPatterns.number.test(password)) {
          return false;
        }
        if (config.auth.passwordRequireSpecialChars && !passwordPatterns.special.test(password)) {
          return false;
        }
        return true;
      },
      {
        message: `Password must contain at least: one uppercase letter, one lowercase letter, one number, and one special character (!@#$%^&*(),.?":{}|<>)`,
      }
    ),
});

interface AuthContextType {
  user: User | null;
  dbUser: DbUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string; }>;
  signUp: (email: string, password: string) => Promise<{ success: boolean; error?: string; requiresConfirmation?: boolean; }>;
  signInWithGoogle: (redirectPath?: string) => Promise<{ success: boolean; error?: string; }>;
  signOut: () => Promise<{ success: boolean; error?: string; }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ 
  children, 
  initialDbUser 
}: { 
  children: React.ReactNode;
  initialDbUser?: DbUser | null;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [dbUser, setDbUser] = useState<DbUser | null>(initialDbUser || null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  
  // Fetch user data from database when needed
  const fetchDbUser = async () => {
    try {
      const response = await fetch('/api/user');
      if (response.ok) {
        const userData = await response.json();
        setDbUser(userData);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  // Initialize auth state and listen for changes
  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);

      // Only fetch dbUser if we don't have initial data and user is authenticated
      if (session?.user && !initialDbUser) {
        await fetchDbUser();
      }

      setLoading(false);
    };

    getSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);

      if (session?.user && event === 'SIGNED_IN') {
        // Only fetch fresh data on actual sign-in events
        await fetchDbUser();
      } else if (!session?.user) {
        setDbUser(null);
      }

      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth, initialDbUser]);

  const signIn = async (email: string, password: string) => {
    try {
      // Validate input
      const result = signInSchema.safeParse({ email, password });
      if (!result.success) {
        return { success: false, error: result.error.errors[0].message };
      }

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.log(`[AUTH] Sign in failed: ${email} - ${error.message}`);
        
        // Check for rate limiting
        if (error.message.includes('rate limit') || error.status === 429) {
          // Extract retry time if available
          const retryAfter = error.message.match(/try again in (\d+) seconds/)?.[1];
          const retryMessage = retryAfter 
            ? `Too many login attempts. Please try again in ${retryAfter} seconds.`
            : 'Too many login attempts. Please wait a few minutes before trying again.';
          return { 
            success: false, 
            error: retryMessage
          };
        }
        
        return { 
          success: false, 
          error: 'Invalid email or password. Please check your credentials and try again.' 
        };
      }

      console.log(`[AUTH] Sign in success: ${email}`);
      return { success: true };

    } catch (error) {
      console.error('[AUTH] Sign in error:', error);
      return { success: false, error: 'An unexpected error occurred. Please try again.' };
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      // Validate input with enhanced password requirements
      const result = signUpSchema.safeParse({ email, password });
      if (!result.success) {
        return { success: false, error: result.error.errors[0].message };
      }

      const { data: authData, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${config.app.url}${config.auth.paths.callback}`,
        }
      });

      if (error) {
        console.log(`[AUTH] Sign up failed: ${email} - ${error.message}`);
        
        // Handle specific error cases
        if (error.message.includes('already registered') || 
            error.message.includes('already exists')) {
          return { 
            success: false, 
            error: 'An account with this email already exists. Please sign in instead.' 
          };
        }
        
        if (error.message.includes('rate limit') || error.status === 429) {
          // Extract retry time if available
          const retryAfter = error.message.match(/try again in (\d+) seconds/)?.[1];
          const retryMessage = retryAfter 
            ? `Too many sign-up attempts. Please try again in ${retryAfter} seconds.`
            : 'Too many sign-up attempts. Please wait a few minutes before trying again.';
          return { 
            success: false, 
            error: retryMessage
          };
        }
        
        return { 
          success: false, 
          error: 'Unable to create account. Please try again.' 
        };
      }

      // Check if user already exists (Supabase anti-enumeration)
      if (authData.user && authData.user.identities && authData.user.identities.length === 0) {
        console.log(`[AUTH] Existing user signup attempt: ${email}`);
        return { 
          success: false, 
          error: 'An account with this email already exists. Please sign in instead.' 
        };
      }

      console.log(`[AUTH] Sign up success: ${email} - needs confirmation: ${!authData.session}`);

      // User needs email confirmation
      if (authData.user && !authData.session) {
        return {
          success: true,
          requiresConfirmation: true
        };
      }

      // User is immediately signed in
      return { success: true };

    } catch (error) {
      console.error('[AUTH] Sign up error:', error);
      return { success: false, error: 'An unexpected error occurred. Please try again.' };
    }
  };

  const signInWithGoogle = async (redirectPath?: string) => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}${config.auth.paths.callback}${
            redirectPath ? `?next=${encodeURIComponent(redirectPath)}` : ''
          }`,
        },
      });

      if (error) {
        console.error('[AUTH] Google sign in failed:', error);
        return { 
          success: false, 
          error: 'Unable to sign in with Google. Please try again.' 
        };
      }

      // OAuth will redirect, so this is considered success
      return { success: true };

    } catch (error) {
      console.error('[AUTH] Google sign in error:', error);
      return { success: false, error: 'An unexpected error occurred.' };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.log(`[AUTH] Sign out failed: ${user?.email} - ${error.message}`);
        return { success: false, error: 'Failed to sign out. Please try again.' };
      }

      console.log(`[AUTH] Sign out success: ${user?.email}`);
      setUser(null);
      setDbUser(null);
      
      // Force page refresh to trigger server-side auth check
      window.location.href = '/';
      
      return { success: true };

    } catch (error) {
      console.error('[AUTH] Sign out error:', error);
      return { success: false, error: 'An unexpected error occurred.' };
    }
  };

  const value = {
    user,
    dbUser,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 