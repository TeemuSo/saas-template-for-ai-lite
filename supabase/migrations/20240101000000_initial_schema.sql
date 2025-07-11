-- SaaS Template Database Schema (fixed)
-- Production-ready with safe RLS practices

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- USERS TABLE
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  supabase_user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  has_access BOOLEAN NOT NULL DEFAULT false,
  stripe_customer_id TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- PURCHASES TABLE
CREATE TABLE purchases (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  stripe_payment_intent_id TEXT UNIQUE,
  stripe_session_id TEXT UNIQUE,
  amount INTEGER NOT NULL,
  currency VARCHAR(3) NOT NULL DEFAULT 'usd',
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  product_name VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- RLS ON USERS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own data" ON users 
  FOR SELECT USING (auth.uid() = supabase_user_id);

CREATE POLICY "Users can update own data" ON users 
  FOR UPDATE USING (auth.uid() = supabase_user_id);

-- REMOVE insert policy — insert is done via secure function

-- RLS ON PURCHASES
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own purchases" ON purchases 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = purchases.user_id 
      AND users.supabase_user_id = auth.uid()
    )
  );

-- SERVICE ROLE ACCESS TO EVERYTHING (for webhooks)
CREATE POLICY "Service role has full access to users" ON users 
  FOR ALL 
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role has full access to purchases" ON purchases 
  FOR ALL 
  TO service_role
  USING (true)
  WITH CHECK (true);

-- SECURE FUNCTION TO INSERT USER RECORD
CREATE OR REPLACE FUNCTION create_user_profile()
RETURNS void AS $$
BEGIN
  INSERT INTO users (supabase_user_id)
  VALUES (auth.uid())
  ON CONFLICT (supabase_user_id) DO NOTHING;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION create_user_profile() TO authenticated;
GRANT SELECT, INSERT, UPDATE ON users TO authenticated;

-- Grant necessary permissions to service role for webhooks
GRANT ALL ON users TO service_role;
GRANT ALL ON purchases TO service_role;
GRANT USAGE ON SEQUENCE users_id_seq TO service_role;
GRANT USAGE ON SEQUENCE purchases_id_seq TO service_role;

-- INDEXES
CREATE INDEX idx_users_supabase_user_id ON users(supabase_user_id);
CREATE INDEX idx_users_stripe_customer_id ON users(stripe_customer_id);
CREATE INDEX idx_purchases_user_id ON purchases(user_id);
CREATE INDEX idx_purchases_stripe_session_id ON purchases(stripe_session_id);

-- TIMESTAMP TRIGGER FUNCTION
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at 
  BEFORE UPDATE ON users 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_purchases_updated_at 
  BEFORE UPDATE ON purchases 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
