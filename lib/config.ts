/**
 * Centralized configuration for the SaaS template
 * 
 * This file provides a single source of truth for all configuration values.
 * It uses environment variables with sensible defaults.
 * 
 * Benefits:
 * - No hardcoded values scattered throughout the codebase
 * - Easy to customize for different deployments
 * - Type-safe configuration access
 */

export const config = {
  // Application settings
  app: {
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    env: process.env.NODE_ENV || 'development',
  },

  // Stripe payment settings
  stripe: {
    currency: process.env.STRIPE_CURRENCY || 'usd',
    priceId: process.env.STRIPE_PRICE_ID || 'your-price-id',
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || 'your-webhook-secret',
    secretKey: process.env.STRIPE_SECRET_KEY || 'your-secret-key',
    productName: process.env.STRIPE_PRODUCT_NAME || 'SaaS Access',
    successUrl: '/app?payment=success',
    cancelUrl: '/?payment=cancelled',
  },

  // Authentication settings
  auth: {
    // Password requirements (used in auth-provider.tsx)
    passwordMinLength: 8,
    passwordRequireUppercase: true,
    passwordRequireLowercase: true,
    passwordRequireNumbers: true,
    passwordRequireSpecialChars: true,
    
    // Auth-related paths
    paths: {
      callback: '/auth/callback',
      signIn: '/sign-in',
      signUp: '/sign-up',
      afterSignIn: '/app',
      afterSignUp: '/app',
    },
    
    // Legacy support - keep for backward compatibility
    emailRedirectTo: '/auth/callback',
  },
  supabase: {
    projectRef: process.env.NEXT_PUBLIC_SUPABASE_URL?.split('.')[0].split('//')[1] || 'your-project-ref',
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project-ref.supabase.co',
    supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key',
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || 'your-service-role-key',
  },

  // Rate limiting settings (used in rate-limit.ts)
  rateLimit: {
    enabled: true,
    apiRequestsPerMinute: 60,
    windowMs: 60 * 1000, // 1 minute
  },
} as const;

// Type-safe config access
export type Config = typeof config; 