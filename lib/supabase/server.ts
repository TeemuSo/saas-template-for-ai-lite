import 'server-only';

import { createServerClient } from '@supabase/ssr';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { Database } from './types';
import { config, requireEnv } from '@/lib/config';

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

// Service role client for admin operations (bypasses RLS).
// Deliberately cookie-free: if it read the user's session cookies,
// supabase-js would send the user's JWT instead of the service role key
// and every query would run as that user.
export function createServiceClient() {
  return createSupabaseClient<Database>(
    config.supabase.supabaseUrl,
    requireEnv('SUPABASE_SERVICE_ROLE_KEY'),
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    }
  );
}
