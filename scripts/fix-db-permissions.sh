#!/bin/bash

# Fix Database Permissions Script
# This script grants necessary permissions to the database user

echo "Fixing database permissions..."
echo "=============================="
echo ""

# Check if psql is available
if ! command -v psql &> /dev/null; then
    echo "Error: PostgreSQL (psql) is not installed or not in PATH"
    exit 1
fi

# Default values
DB_NAME="newsblogs_db"
DB_USER="user"
SUPERUSER="postgres"

echo "Enter PostgreSQL superuser (default: postgres):"
read -r SUPERUSER_INPUT
SUPERUSER=${SUPERUSER_INPUT:-$SUPERUSER}

echo "Enter database name (default: newsblogs_db):"
read -r DB_NAME_INPUT
DB_NAME=${DB_NAME_INPUT:-$DB_NAME}

echo "Enter database user name (default: user):"
read -r DB_USER_INPUT
DB_USER=${DB_USER_INPUT:-$DB_USER}

echo ""
echo "Granting permissions to user '$DB_USER' on database '$DB_NAME'..."
echo ""

# Grant privileges
psql -U "$SUPERUSER" -d "$DB_NAME" << EOF
-- Grant all privileges on the database
GRANT ALL PRIVILEGES ON DATABASE "$DB_NAME" TO "$DB_USER";

-- Connect to the database
\c "$DB_NAME"

-- Grant all privileges on the schema
GRANT ALL ON SCHEMA public TO "$DB_USER";

-- Grant all privileges on all tables in the schema
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO "$DB_USER";

-- Grant all privileges on all sequences in the schema
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO "$DB_USER";

-- Set default privileges for future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO "$DB_USER";

-- Set default privileges for future sequences
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO "$DB_USER";
EOF

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Permissions granted successfully!"
    echo ""
    echo "Next steps:"
    echo "1. Restart your Next.js dev server (Ctrl+C then 'npm run dev')"
    echo "2. The database access error should be resolved"
else
    echo ""
    echo "❌ Error granting permissions. Please check:"
    echo "   - PostgreSQL is running"
    echo "   - You have superuser access"
    echo "   - Database and user exist"
fi

