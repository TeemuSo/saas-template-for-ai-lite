'use client';

import { createBrowserClient } from '@supabase/ssr';
import { Database } from './types';
import { config } from '@/lib/config';

export function createClient() {
  return createBrowserClient<Database>(
    config.supabase.supabaseUrl,
    config.supabase.supabaseAnonKey
  );
} 