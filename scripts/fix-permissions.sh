#!/bin/bash

# Quick fix for database permissions
# This script grants all necessary permissions to the 'user' on 'newsblogs_db'

DB_NAME="newsblogs_db"
DB_USER="user"
SUPERUSER="postgres"

echo "Fixing database permissions for user '$DB_USER' on database '$DB_NAME'..."
echo ""

# Run SQL commands to fix permissions
psql -U "$SUPERUSER" -d postgres << EOF
-- Grant database privileges
GRANT ALL PRIVILEGES ON DATABASE "$DB_NAME" TO "$DB_USER";

-- Connect to the specific database and grant schema privileges
\c "$DB_NAME"

-- Grant schema privileges
GRANT ALL ON SCHEMA public TO "$DB_USER";
GRANT USAGE ON SCHEMA public TO "$DB_USER";

-- Grant privileges on all existing tables
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO "$DB_USER";

-- Grant privileges on all existing sequences
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO "$DB_USER";

-- Set default privileges for future objects
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO "$DB_USER";
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO "$DB_USER";
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO "$DB_USER";

-- Make user owner of public schema (optional but ensures full control)
ALTER SCHEMA public OWNER TO "$DB_USER";
EOF

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Permissions fixed successfully!"
    echo ""
    echo "Please restart your Next.js dev server."
else
    echo ""
    echo "❌ Error fixing permissions. Please check:"
    echo "   - PostgreSQL is running"
    echo "   - You're using the correct superuser (default: postgres)"
    echo "   - Database '$DB_NAME' exists"
    echo "   - User '$DB_USER' exists"
fi


