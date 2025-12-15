-- Fix Database Permissions for geneveda_user
-- Run this as a superuser: psql -U postgres -d newsblogs_db -f scripts/fix-geneveda-permissions.sql
-- Or connect to psql and run these commands manually

-- Grant schema privileges
GRANT ALL ON SCHEMA public TO "geneveda_user";
GRANT USAGE ON SCHEMA public TO "geneveda_user";

-- Grant privileges on all existing tables
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO "geneveda_user";

-- Grant privileges on all existing sequences
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO "geneveda_user";

-- Set default privileges for future objects
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO "geneveda_user";
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO "geneveda_user";
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO "geneveda_user";

-- Make user owner of public schema (ensures full control)
ALTER SCHEMA public OWNER TO "geneveda_user";


