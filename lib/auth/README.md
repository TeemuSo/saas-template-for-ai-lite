# 🔐 Next.js 15 Authentication with DAL Pattern

A modern authentication system using Next.js 15 Data Access Layer (DAL) patterns with Supabase. This approach follows Next.js best practices for server-first authentication.

## ✨ Features

- **Next.js 15 DAL**: Server-first authentication with React cache()
- **Supabase Auth**: Complete authentication with email/password and OAuth providers
- **Request Memoization**: Cached user data during React render pass
- **Route Protection**: Middleware-based authentication for protected routes
- **Type-Safe**: Full TypeScript implementation with auto-generated types
- **Beginner-Friendly**: Clean, simple patterns that scale

## 🏗️ Architecture

```
auth/
├── dal.ts               # Data Access Layer (core auth functions)
├── auth-provider.tsx    # Client-side auth context
├── middleware.ts        # Server action validation helpers
└── example-server-actions.ts  # Example server actions with auth
```

## 🚀 Quick Setup

### 1. Environment Variables

```bash
# Required - Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 2. Supabase Setup

1. Create a new Supabase project
2. Configure authentication providers in Supabase dashboard
3. Set up email templates for sign-up confirmations
4. Configure redirect URLs for your domain

## 📊 Logging

All auth events are logged to console and automatically captured by Vercel:

```typescript
// Automatically logged:
[AUTH] SIGN_IN_SUCCESS: user@example.com
[AUTH] SIGN_UP_FAILED: user@example.com  
[ANALYTICS] user_purchased: { plan: 'pro' }
```

## 🔧 Usage Patterns

### Server Components (Recommended)

```tsx
import { getUser, getUserWithAccess, getOptionalUser } from '@/lib/auth/dal';

// Basic authentication check
export default async function ProtectedPage() {
  const userData = await getUser();
  
  return <div>Welcome {userData.email}</div>;
}

// Require paid access
export default async function PremiumPage() {
  const userData = await getUserWithAccess();
  
  return <div>Premium content for {userData.email}</div>;
}

// Optional auth (show different content based on auth status)
export default async function LandingPage() {
  const userData = await getOptionalUser();
  
  if (userData) {
    return <div>Welcome back {userData.email}</div>;
  }
  
  return <div>Please sign in to continue</div>;
}
```

### Client Components

```tsx
import { useAuth } from '@/lib/auth/auth-provider';

function MyComponent() {
  const { user, dbUser, loading, signOut } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  
  if (!user) return <div>Please sign in</div>;
  
  return (
    <div>
      <p>Welcome {user.email}</p>
      <p>Access: {dbUser?.has_access ? 'Premium' : 'Free'}</p>
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
}
```

### API Routes

```tsx
import { getApiUser, getUserPurchases } from '@/lib/auth/dal';
import { NextResponse } from 'next/server';

// GET /api/user
export async function GET() {
  try {
    const userData = await getApiUser();
    return NextResponse.json(userData.dbUser);
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

// GET /api/user/purchases
export async function GET() {
  try {
    const purchases = await getUserPurchases();
    return NextResponse.json(purchases);
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
```

## 🔧 Extending the DAL

### Adding Custom Auth Checks

```typescript
// lib/auth/dal.ts
export const getUserWithCustomCheck = cache(async (requiredRole: string) => {
  const userData = await getUser();
  
  // Add your custom logic here
  const hasRole = await checkUserRole(userData.dbUser.id, requiredRole);
  
  if (!hasRole) {
    redirect('/unauthorized');
  }
  
  return userData;
});
```

### Adding New User Properties

```typescript
// After updating your database schema, DAL functions automatically
// get the new properties via auto-generated types

const userData = await getUser();
// userData.dbUser now includes new properties
console.log(userData.dbUser.newProperty);
```

### Custom Redirect Logic

```typescript
// All DAL functions accept optional redirect parameter
const userData = await getUser('/custom-sign-in');
const premiumUser = await getUserWithAccess('/upgrade-required');
```

## 🔒 Security Features

✅ **Server-First Authentication** - Auth checks on server, not client  
✅ **Supabase Auth** - Industry-standard authentication service  
✅ **Row Level Security** - Database-level access control  
✅ **Request Memoization** - Efficient, cached auth checks  
✅ **Route Protection** - Middleware-based authentication checks  
✅ **Secure Sessions** - Handled by Supabase with secure cookies

## 🎯 Best Practices

### Server-Side Authentication
1. **Always use DAL functions** for auth checks in Server Components
2. **Use `getUser()` for basic auth** - redirects to sign-in if not authenticated
3. **Use `getUserWithAccess()` for premium features** - redirects to payment if no access
4. **Use `getOptionalUser()` for conditional content** - doesn't redirect

### Client-Side Authentication
1. **Use `useAuth()` hook** for reactive UI state
2. **Don't make auth decisions on client** - server should handle auth logic
3. **Use client components sparingly** - prefer server components for auth

### API Routes
1. **Use `getApiUser()` for API auth** - throws error instead of redirecting
2. **Handle auth errors properly** - return 401 status for unauthorized
3. **Use `getUserPurchases()` for user-specific data** - includes auth check

### Performance
1. **DAL functions are cached** - multiple calls in same request are efficient
2. **Server Components are faster** - no client-side auth checks needed
3. **Reduce client-side API calls** - use server-side data when possible

## 🎯 DAL Functions Reference

### Core Authentication Functions

| Function | Use Case | Returns | Redirects |
|----------|----------|---------|----------|
| `verifySession()` | Basic auth check | User session | Yes, to sign-in |
| `getUser()` | Get user + DB record | User + DB data | Yes, to sign-in |
| `getUserWithAccess()` | Premium features | User + DB data | Yes, to payment |
| `getOptionalUser()` | Optional auth | User data or null | No |
| `userHasRole()` | Role-based access | Boolean | No |

### API Route Functions

| Function | Use Case | Returns | Throws Error |
|----------|----------|---------|-------------|
| `verifyApiSession()` | API auth check | User session | Yes |
| `getApiUser()` | API user + DB | User + DB data | Yes |
| `getUserPurchases()` | User's purchases | Purchase array | Yes |

### Request Memoization

All DAL functions use React `cache()` for request memoization:

```typescript
// Multiple calls in same request = single database query
const userData1 = await getUser();
const userData2 = await getUser(); // Uses cached result
```

## 🚀 Database Integration

Users are linked to Supabase Auth via the `users` table:

```sql
-- Database schema
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  supabase_user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id),
  has_access BOOLEAN NOT NULL DEFAULT false,
  stripe_customer_id TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**User Lifecycle:**
1. User signs up via Supabase Auth
2. User record created in `users` table with `has_access: false`
3. User completes payment → `has_access: true`
4. User can access premium features 