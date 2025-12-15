-- Fix Database Permissions Script
-- Run this script as a PostgreSQL superuser (usually 'postgres')

-- Connect to the database
\c newsblogs_db;

-- Grant all privileges on the database to the user
GRANT ALL PRIVILEGES ON DATABASE newsblogs_db TO "user";

-- Grant all privileges on the schema
GRANT ALL ON SCHEMA public TO "user";

-- Grant all privileges on all tables in the schema
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO "user";

-- Grant all privileges on all sequences in the schema
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO "user";

-- Set default privileges for future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO "user";

-- Set default privileges for future sequences
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO "user";

-- Make the user the owner of the schema (optional, but ensures full control)
ALTER SCHEMA public OWNER TO "user";

