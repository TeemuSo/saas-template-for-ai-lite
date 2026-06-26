# AGENTS.md

Single source of truth for AI agents working in this repo (Cursor, Claude Code, etc.).
`CLAUDE.md` and `.cursor/rules/*` defer to this file — keep them consistent with it.

## Stack
- **Next.js 15** (App Router) + React, **TypeScript**
- **Supabase** — Postgres + Auth, Row Level Security (RLS)
- **Stripe** — one-time payments via webhook
- **Tailwind CSS 4** + Radix UI / shadcn
- Package manager: **pnpm** (not npm/yarn)

## Folder conventions
- New **protected page** → `app/app/<route>/page.tsx` (auth handled by the layout — see Auth model)
- New **public page** → `app/<route>/page.tsx`
- New **API route** → `app/api/<route>/route.ts` (Route Handlers; this template has **no Server Actions**)
- New **component** → `components/` (shared primitives in `components/ui/`)
- **Auth / DAL** helpers → `lib/auth/`; **service-role DB writes** → `lib/db/queries.ts`; **Stripe** → `lib/payments/`; **Supabase clients** → `lib/supabase/`
- **Config & env access** → `lib/config.ts`
- **Brand / theme tokens** (`--primary`, `--neutral`, …) → `app/globals.css` (NOT `lib/utils.ts`, which only exports `cn()`)

## Auth model
- Supabase Auth (email/password + OAuth).
- `middleware.ts` does an **optimistic** cookie check that redirects unauthenticated users away from `/app/*` and returns 401 for `/api/*`. It is fast but is **not** the real security boundary.
- The real guard is the **Data Access Layer** in `lib/auth/dal.ts`:
  - `getUser()` — authenticated user + DB record (redirects if not signed in)
  - `getUserWithAccess()` — also requires paid access (`has_access`)
  - `getOptionalUser()` — returns `null` instead of redirecting
  - `getApiUser()` / `verifyApiSession()` — API-route variants that **throw** instead of redirect
- Client UI uses `useAuth()` from `lib/auth/auth-provider.tsx` — reactive state only, never a security boundary.

## Invariants (do not break)
1. **Protected pages**: every `app/app/*` page is guarded by `getUserWithAccess()` in `app/app/layout.tsx`. The layout is the single guard — new pages under `app/app/` need no extra auth check.
2. **Data fetching**: raw `fetch` only — no swr, no react-query (removed). e.g. `await fetch('/api/user')`.
3. **Rate limiting**: handled centrally in `middleware.ts` for all `/api/*` (except `/api/health` and `/api/stripe/webhook`) via `lib/rate-limit.ts`. To rate-limit manually:
   ```ts
   import { checkRateLimit, getIpFromRequest } from '@/lib/rate-limit';
   const { success } = checkRateLimit(getIpFromRequest(request));
   if (!success) return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
   ```
4. **Stripe / `has_access` writes**: only the **service-role** Stripe webhook (`app/api/stripe/webhook/route.ts` → `lib/db/queries.ts` via `createServiceClient()`) may write the `users` row. RLS forbids the `authenticated`/client role from updating `users` — never grant access from client or DAL code.
5. **Required server secrets** (`STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `SUPABASE_SERVICE_ROLE_KEY`) throw at startup **in production** if missing (`requiredServerSecret` in `lib/config.ts`); development falls back to harmless placeholders.
6. **No Server Actions**: all mutations go through Route Handlers in `app/api/*`.

## Where to look
- Env vars: `.env.example`
- DB schema & RLS: `supabase/migrations/`
- Setup: `SETUP.md` · Styling: `STYLING.md` · Auth deep-dive: `lib/auth/README.md` · Database: `lib/db/README.md`
