# Database Layer - Supabase with Next.js 15

This directory contains the database setup using **Supabase** with Next.js 15 DAL patterns for a modern SaaS template.

## Why Supabase?

- **One tool to learn** - Database, auth, and APIs in one place
- **Visual dashboard** - See your tables and data in the browser  
- **Built-in security** - Row Level Security (RLS) protects user data
- **Auto-generated types** - Perfect TypeScript integration
- **No complex setup** - Just SQL and simple queries
- **DAL Integration** - Works seamlessly with Next.js 15 patterns

## Key Files

- `queries.ts` - **Service-role functions** for webhooks and system operations
- `../auth/dal.ts` - **User-facing functions** with auth checks and RLS
- `../supabase/types.ts` - **Auto-generated types** from your database
- `../supabase/server.ts` - **Server client** for API routes
- `../supabase/client.ts` - **Browser client** for auth
- `../../supabase/migrations/` - **Database migrations** that create your schema

## Database Schema

Your database has just **2 tables** with clear separation of concerns:

### `users` Table
Links your business data to Supabase auth users:
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  supabase_user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id),
  has_access BOOLEAN NOT NULL DEFAULT false,
  stripe_customer_id TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### `purchases` Table  
Tracks successful payments:
```sql
CREATE TABLE purchases (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  stripe_payment_intent_id TEXT,
  stripe_session_id TEXT,
  amount INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'usd',
  status TEXT NOT NULL DEFAULT 'completed',
  product_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Row Level Security (RLS)

**RLS automatically protects your data**:
- Users can only see **their own** data
- Webhooks can access **all** data (using service role)
- No need to manually filter queries

## Quick Start

### 1. Set Up Database
```bash
# Use the Supabase CLI to apply migrations:
supabase db reset
# Or apply new migrations:
supabase migration up
```

### 2. Generate Types
```bash
# This creates perfect TypeScript types from your database
pnpm db:types
# or manually:
# supabase gen types typescript --project-id your-project > lib/supabase/types.ts
```

### 3. Set Environment Variables
```bash
# Add to your .env.local:
NEXT_PUBLIC_SUPABASE_URL="your-project-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key" 
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
```

## Two-Layer Architecture

### Layer 1: User-Facing (DAL) - `../auth/dal.ts`
For **authenticated user operations** with RLS protection:

```typescript
import { getApiUser, getUserPurchases } from '@/lib/auth/dal';

// API Route - Get current user
export async function GET() {
  const userData = await getApiUser(); // Auth check + user data
  return NextResponse.json(userData.dbUser);
}

// API Route - Get user's purchases
export async function GET() {
  const purchases = await getUserPurchases(); // Auth check + user's purchases only
  return NextResponse.json(purchases);
}
```

### Layer 2: Service-Role (System) - `queries.ts`
For **system operations** that bypass RLS (webhooks, admin tasks):

```typescript
import { grantUserAccess, createPurchase } from '@/lib/db/queries';

// Stripe Webhook - Grant access after payment
export async function POST(request: Request) {
  const { supabaseUserId } = await request.json();
  
  // Service role bypasses RLS for system operations
  await grantUserAccess(supabaseUserId);
  
  await createPurchase({
    supabaseUserId,
    amount: 4900,
    currency: 'usd',
    productName: 'SaaS Access'
  });
}
```

### Custom Queries (Advanced)
```typescript
import { createClient } from '@/lib/supabase/server';

// User-scoped query (RLS applies)
const supabase = await createClient();
const { data } = await supabase
  .from('users')
  .select('*')
  .eq('has_access', true); // RLS automatically filters to current user

// System-scoped query (bypasses RLS)
const serviceSupabase = await createServiceClient();
const { data: allUsers } = await serviceSupabase
  .from('users')
  .select('*')
  .eq('has_access', true); // Gets ALL users with access
```

## Benefits for Beginners

✅ **Clear separation** - DAL for users, queries for system operations  
✅ **See your data** - Use Supabase dashboard to view tables  
✅ **No complex setup** - Migrations handle schema management  
✅ **Perfect types** - Generated automatically from database  
✅ **Built-in security** - RLS protects data automatically  
✅ **Simple queries** - No ORM complexity  
✅ **Great docs** - Supabase documentation is excellent  
✅ **Next.js 15 patterns** - Follows modern best practices  

## Environment Variables

### Required Variables
```bash
# Supabase connection (from Supabase dashboard)
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"

# Service role for webhooks (from Supabase dashboard)  
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
```

## 🚨 Critical Migration Rules (READ FIRST!)

**⚠️ NEVER DO THESE - THEY WILL BREAK SIGN-UP FLOW:**

### ❌ Don't Modify the `users` Table
```sql
-- NEVER modify existing users table policies
-- NEVER add triggers to users table  
-- NEVER change users table structure
-- The existing setup is perfectly designed for auth
```

### ❌ Don't Add Complex Triggers
```sql
-- BAD - This breaks during user creation:
CREATE OR REPLACE FUNCTION log_changes()
RETURNS TRIGGER AS $$
BEGIN
  SELECT id FROM users WHERE supabase_user_id = auth.uid(); -- FAILS!
END;

-- GOOD - Handle missing users gracefully:
CREATE OR REPLACE FUNCTION log_changes()
RETURNS TRIGGER AS $$
BEGIN
  -- Skip if no authenticated user (during sign-up)
  IF auth.uid() IS NULL THEN
    RETURN COALESCE(NEW, OLD);
  END IF;
  -- Rest of function...
END;
```

### ❌ Don't Reference Missing Functions
```sql
-- BAD - Creates trigger for non-existent function:
CREATE TRIGGER my_trigger EXECUTE FUNCTION missing_function();

-- GOOD - Create function first:
CREATE OR REPLACE FUNCTION my_function() RETURNS TRIGGER AS $$
BEGIN
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER my_trigger BEFORE UPDATE ON my_table 
  FOR EACH ROW EXECUTE FUNCTION my_function();
```

### ✅ Safe Migration Pattern
```sql
-- 1. Create types and functions first
-- 2. Create tables (no triggers yet)
-- 3. Add indexes
-- 4. Enable RLS with simple policies
-- 5. Add safe triggers last
-- 6. ALWAYS test sign-up flow after migration!
```

## Function Reference

### DAL Functions (User-Facing)
| Function | Purpose | Auth Required | RLS Applied |
|----------|---------|---------------|-------------|
| `getApiUser()` | Get current user + DB record | Yes | Yes |
| `getUserPurchases()` | Get user's purchases only | Yes | Yes |

### Service Functions (System-Only)
| Function | Purpose | Auth Required | RLS Applied |
|----------|---------|---------------|-------------|
| `grantUserAccess()` | Grant access after payment | No | No |
| `revokeUserAccess()` | Revoke access (refunds) | No | No |
| `createPurchase()` | Record successful payment | No | No |
| `updateUserStripeCustomerId()` | Link Stripe customer | No | No |
| `getUsersByStripeCustomerId()` | Find user by Stripe ID | No | No |

## Common Tasks

### Add a New Table
1. **Create new migration**: `supabase migration new add_table_name`
2. **Add SQL** to the new migration file
3. **Enable RLS** and create policies in the migration
4. **Apply migration**: `supabase migration up`
5. **Regenerate types**: `supabase gen types typescript`
6. **Add DAL functions** to `../auth/dal.ts` for user operations
7. **Add service functions** to `queries.ts` for system operations
8. **🔥 TEST SIGN-UP FLOW** - Verify auth still works!

### View Your Data
1. Go to **Supabase Dashboard**
2. Click **Table Editor**  
3. See all your data visually

### Test Sign-Up After Migrations
```bash
# Always verify auth flow works after new migrations:
pnpm dev
# Test: Sign up → Check email → Click link → Should reach /app
```

### Debug RLS Issues
1. **Check policies** in Supabase dashboard
2. **Test queries** in SQL editor
3. **Use service role** for admin operations

## Architecture Decisions

This template chooses **simplicity over complexity**:

❌ **Complex**: Drizzle ORM + Migrations + Connection management  
✅ **Simple**: Supabase + SQL + Auto-generated types

❌ **Complex**: Multiple config files and build steps  
✅ **Simple**: Migration-based schema and environment variables

❌ **Complex**: Manual type definitions and schema sync  
✅ **Simple**: Auto-generated types that are always correct

❌ **Complex**: Mixed auth/system operations  
✅ **Simple**: Clear DAL vs service-role separation

### Why Two Layers?

1. **Security**: User operations use RLS, system operations bypass it
2. **Clarity**: Clear separation between user-facing and system operations
3. **Performance**: Service operations don't need auth checks
4. **Debugging**: Easy to trace which layer is being used
5. **Next.js 15**: Follows modern server-first patterns

## Need Help?

1. **Supabase docs** - Excellent beginner resources
2. **SQL Editor** - Test queries in your dashboard  
3. **Table Editor** - Visual database management
4. **Logs** - See what's happening in real-time

This two-layer approach gets you building SaaS features **faster** while learning **best practices** for data security, TypeScript integration, and Next.js 15 patterns.

## Quick Decision Guide

**Use DAL Functions When:**
- Building API routes for authenticated users
- User needs to see their own data
- Building user-facing features
- You need auth checks

**Use Service Functions When:**
- Processing webhooks (Stripe, etc.)
- Admin operations
- System-level tasks
- You need to bypass user restrictions

**Example: Purchase Flow**
```typescript
// 1. User initiates purchase (DAL)
const userData = await getApiUser(); // Auth check + user data

// 2. Stripe webhook processes payment (Service)
await grantUserAccess(supabaseUserId); // Bypass RLS
await createPurchase(purchaseData); // System operation

// 3. User views purchase history (DAL)
const purchases = await getUserPurchases(); // Auth check + user's purchases only
``` 