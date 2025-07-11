# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with this Next.js 15 SaaS template.

## Development Commands

### Core Development
```bash
# Install dependencies (requires pnpm)
pnpm install

# Start development server with Turbopack
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Generate TypeScript types from Supabase
pnpm db:types
```

### Database Operations
```bash
# Apply database migrations
supabase db push

# Reset database (careful - destructive)
supabase db reset

# Link to Supabase project
supabase link --project-ref your-project-id
```

### Stripe Testing
```bash
# Forward webhooks to local development (requires Stripe CLI)
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

## Architecture Overview

This is a Next.js 15 SaaS template using modern **Data Access Layer (DAL)** patterns with server-first authentication. Key architectural decisions:

### Authentication & Authorization (DAL Pattern)
- **Next.js 15 DAL**: Server-first authentication with React `cache()` for request memoization
- **Supabase Auth**: Handles user authentication with email/password and OAuth
- **Two-layer approach**: DAL for user operations, service-role for system operations
- **Request memoization**: Multiple auth checks in same request = single database query
- **Client-side optimization**: AuthProvider relies on server-side initial data
- **Row Level Security (RLS)**: Database-level access control automatically filters user data

### Database Layer (Two-Layer Architecture)
- **User Layer (DAL)**: Functions in `lib/auth/dal.ts` with auth checks and RLS
- **System Layer**: Functions in `lib/db/queries.ts` with service-role (bypasses RLS)
- **Simple schema**: 2-table design (`users`, `purchases`)
- **Auto-generated TypeScript types**: Perfect type safety from database schema
- **Migration-based schema**: SQL migrations in `supabase/migrations/`

### Payment Processing
- **Stripe Integration**: One-time payments with webhook handling
- **Webhook security**: Proper signature verification in `/api/stripe/webhook`
- **Access control**: `has_access` boolean field controls app access
- **System operations**: Webhooks use service-role functions to bypass RLS

### UI Architecture
- **Design System**: 2-variable CSS system (`--primary`, `--neutral`) in `app/globals.css`
- **Component Library**: Radix UI primitives with custom styling
- **Tailwind CSS 4**: Custom theme variables and utility classes
- **Responsive Design**: Mobile-first approach with breakpoint utilities

## Key Directories

### `/app/` - Next.js App Router
- `/app/page.tsx` - Landing page
- `/app/app/` - **Main application area** (customize here)
- `/app/api/` - API routes for server-side functionality
- `/app/(login)/` - Authentication pages (sign-in, sign-up)

### `/lib/` - Core Business Logic
- `/lib/auth/` - Authentication helpers and Data Access Layer
- `/lib/db/` - Database queries and schema utilities
- `/lib/payments/` - Stripe integration and payment processing
- `/lib/supabase/` - Supabase client configuration

### `/components/` - UI Components
- `/components/ui/` - Base UI components (buttons, inputs, cards)
- `/components/` - App-specific components (header, footer, hero)

## Development Patterns

### Adding New Features
1. **Follow authentication patterns**: Use `getUser()` for server-side, `useAuth()` for client-side
2. **Use existing database queries**: Extend `lib/db/queries.ts` rather than writing raw SQL
3. **Apply rate limiting**: New API routes should include rate limiting
4. **Follow design system**: Use CSS variables and Tailwind utilities

### Data Access Layer (DAL) Pattern

**Server Components (Recommended)**
```typescript
// DAL functions with auth checks and RLS
import { getUser, getUserWithAccess, getOptionalUser } from '@/lib/auth/dal';

// Protected page - redirects if not authenticated
const userData = await getUser();

// Premium feature - redirects if no payment
const userData = await getUserWithAccess();

// Optional auth - returns null if not authenticated
const userData = await getOptionalUser();

// All functions use React cache() for request memoization
```

**API Routes**
```typescript
// API-specific functions that throw errors instead of redirecting
import { getApiUser, getUserPurchases } from '@/lib/auth/dal';

// Get authenticated user + database record
const userData = await getApiUser();

// Get user's purchases (auth + RLS applied)
const purchases = await getUserPurchases();
```

**System Operations (Webhooks)**
```typescript
// Service-role functions that bypass RLS
import { grantUserAccess, createPurchase } from '@/lib/db/queries';

// Grant access after payment (system operation)
await grantUserAccess(supabaseUserId);

// Create purchase record (system operation)
await createPurchase(purchaseData);
```

**Client Components (Interactive UI)**
```typescript
// Use only for reactive UI elements
import { useAuth } from '@/lib/auth/auth-provider';
const { user, dbUser, loading } = useAuth(); // Optimized with server-side initial data
```

## Security Considerations

### Critical Security Patterns
- **Never skip authentication**: Always verify user identity in API routes
- **Use Row Level Security**: Database automatically filters data per user
- **Webhook verification**: Stripe webhooks must verify signatures
- **Rate limiting**: Applied to all API routes except public webhooks
- **Environment variables**: Keep secrets in `.env.local`, never commit

### Database Migration Safety
- **Test sign-up flow**: Always verify authentication works after migrations
- **No complex triggers**: Avoid triggers that might break during user creation
- **Create functions before triggers**: Ensure all referenced functions exist

## Environment Setup

### Required Environment Variables
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Stripe
STRIPE_SECRET_KEY=sk_test_your-key
STRIPE_PRICE_ID=price_your-price-id
STRIPE_WEBHOOK_SECRET=whsec_your-secret

# Site
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Testing

### Manual Testing Flow
1. **Sign up**: Create new account → verify email → should redirect to `/app`
2. **Payment**: Click "Get Access" → complete checkout → verify webhook received
3. **Access control**: Verify `has_access` is `true` in database
4. **App access**: User should be able to access `/app` routes

### Test Payment Cards
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- Use any future date and any 3-digit CVC

## Customization Areas

### Branding (2-variable system)
- `app/globals.css` - Change `--primary` and `--neutral` variables
- All components automatically inherit brand colors

### Main Application
- `app/app/page.tsx` - Main application dashboard
- `app/app/` - Add new protected pages here

### Landing Page
- `app/page.tsx` - Landing page content
- `components/hero-section.tsx` - Hero section
- `components/features-section.tsx` - Features section

## Common Issues

### Sign-up Flow Breaks
- Check database migrations didn't add complex triggers
- Verify RLS policies allow user creation
- Test with fresh incognito browser session

### Payment Issues
- Verify webhook endpoint is reachable
- Check Stripe webhook secret matches environment variable
- Ensure webhook includes `checkout.session.completed` event

### Type Errors
- Regenerate types: `pnpm db:types`
- Restart TypeScript server in your editor

## DAL vs Service-Role Decision Guide

### Use DAL Functions When:
- Building Server Components
- Building API routes for authenticated users
- User needs to see their own data
- You need auth checks + RLS protection

### Use Service Functions When:
- Processing webhooks (Stripe, etc.)
- Admin operations
- System-level tasks
- You need to bypass user restrictions

### Example: Complete Purchase Flow
```typescript
// 1. User initiates purchase (DAL)
const userData = await getApiUser(); // Auth check + user data

// 2. Stripe webhook processes payment (Service)
await grantUserAccess(supabaseUserId); // Bypass RLS
await createPurchase(purchaseData); // System operation

// 3. User views purchase history (DAL)
const purchases = await getUserPurchases(); // Auth check + user's purchases only
```

## Performance Benefits

- **Request Memoization**: DAL functions use React `cache()` - multiple calls in same request = single database query
- **Server-First**: Auth checks happen on server, not client
- **Optimized AuthProvider**: Relies on server-side initial data, eliminates redundant API calls
- **Efficient RLS**: Database-level filtering instead of application-level filtering

## Important Notes

- **Package manager**: This project requires `pnpm` (not npm or yarn)
- **Node version**: Requires Node.js 18+
- **Database**: Always use Supabase migrations for schema changes
- **Styling**: Use Tailwind CSS 4 with custom theme variables
- **Testing**: No automated tests configured - relies on manual testing flow
- **Authentication**: Always prefer DAL functions over direct Supabase client calls
- **No Server Actions**: This template avoids server actions for simplicity