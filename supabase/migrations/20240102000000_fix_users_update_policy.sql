-- Fix: revenue-bypass hole on public.users
--
-- The initial schema granted UPDATE on public.users to the `authenticated`
-- role and defined an UPDATE policy with a USING clause but NO WITH CHECK.
-- Because Postgres only applies WITH CHECK to the *new* row, a logged-in
-- user could call `update({ has_access: true })` (or set their own
-- stripe_customer_id) straight from the browser and unlock paid access
-- without ever paying through Stripe.
--
-- This template has NO legitimate client-side write path to public.users:
--   * the app only ever SELECTs the user row (see lib/auth/dal.ts), and
--   * all writes (granting access, storing the Stripe customer id, purchases)
--     happen server-side through the service_role in the Stripe webhook.
--
-- Therefore the safe, minimal fix is to remove client UPDATE access entirely.
-- The service_role still has full access via its own policy + GRANT ALL.

-- 1. Drop the unsafe UPDATE policy (no WITH CHECK -> uncontrolled writes).
DROP POLICY IF EXISTS "Users can update own data" ON public.users;

-- 2. Remove the table-level UPDATE privilege from authenticated users.
REVOKE UPDATE ON public.users FROM authenticated;
