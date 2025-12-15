-- Fix Database Permissions
-- Run this as: psql -U postgres -d newsblogs_db -f scripts/fix-permissions.sql
-- Or connect to psql and run these commands manually

-- Grant database privileges
GRANT ALL PRIVILEGES ON DATABASE newsblogs_db TO "user";

-- Grant schema privileges
GRANT ALL ON SCHEMA public TO "user";
GRANT USAGE ON SCHEMA public TO "user";

-- Grant privileges on all existing tables
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO "user";

-- Grant privileges on all existing sequences
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO "user";

-- Set default privileges for future objects
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO "user";
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO "user";
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO "user";

-- Make user owner of public schema (ensures full control)
ALTER SCHEMA public OWNER TO "user";


