-- Users must never write their own row: has_access and stripe_customer_id
-- are set only by the Stripe webhook through the service role.
DROP POLICY IF EXISTS "Users can update own data" ON users;

REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON users FROM anon, authenticated;
REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON purchases FROM anon, authenticated;
GRANT SELECT ON users TO authenticated;
GRANT SELECT ON purchases TO authenticated;

-- Pin search_path so the SECURITY DEFINER function cannot be hijacked
-- by objects created in another schema.
CREATE OR REPLACE FUNCTION public.create_user_profile()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  INSERT INTO public.users (supabase_user_id)
  VALUES (auth.uid())
  ON CONFLICT (supabase_user_id) DO NOTHING;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.create_user_profile() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.create_user_profile() TO authenticated;
