-- Set has_access default to true for new users
-- This means we can access the app without payment
-- Normally has_access is updated as true when stripe payment is successful
ALTER TABLE users ALTER COLUMN has_access SET DEFAULT true;