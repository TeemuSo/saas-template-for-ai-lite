import 'server-only';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Database } from './types';
import { config } from '@/lib/config';

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    config.supabase.supabaseUrl,
    config.supabase.supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}

// Service role client for admin operations (bypasses RLS)
export async function createServiceClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    config.supabase.supabaseUrl,
    config.supabase.supabaseServiceRoleKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Service role operations don't need cookie management
          }
        },
      },
    }
  );
} 