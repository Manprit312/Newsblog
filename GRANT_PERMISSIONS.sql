-- ============================================
-- GRANT PERMISSIONS FOR geneveda_user
-- ============================================
-- This script must be run by a PostgreSQL SUPERUSER
-- Database: newsblogs_db
-- User: geneveda_user
-- Host: 40.192.24.24:5432
-- ============================================

-- Connect to the database
\c newsblogs_db;

-- Grant schema privileges
GRANT ALL ON SCHEMA public TO "geneveda_user";
GRANT USAGE ON SCHEMA public TO "geneveda_user";

-- Grant privileges on all existing tables
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO "geneveda_user";

-- Grant privileges on all existing sequences
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO "geneveda_user";

-- Set default privileges for future objects (tables, sequences, functions)
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO "geneveda_user";
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO "geneveda_user";
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO "geneveda_user";

-- Optional: Make user owner of schema (ensures full control)
ALTER SCHEMA public OWNER TO "geneveda_user";

-- Verify permissions (optional check)
SELECT 
    grantee, 
    privilege_type 
FROM information_schema.role_table_grants 
WHERE grantee = 'geneveda_user' 
AND table_schema = 'public';


