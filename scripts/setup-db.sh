#!/bin/bash

# PostgreSQL Database Setup Script
# This script helps set up the database and user with proper permissions

echo "PostgreSQL Database Setup"
echo "========================"
echo ""

# Check if PostgreSQL is running
if ! command -v psql &> /dev/null; then
    echo "Error: PostgreSQL (psql) is not installed or not in PATH"
    exit 1
fi

# Default values
DB_NAME="newsblogs"
DB_USER="postgres"
DB_PASSWORD=""

echo "Enter PostgreSQL superuser (default: postgres):"
read -r SUPERUSER
SUPERUSER=${SUPERUSER:-postgres}

echo "Enter database name (default: newsblogs):"
read -r DB_NAME
DB_NAME=${DB_NAME:-newsblogs}

echo "Enter database user name (default: postgres):"
read -r DB_USER
DB_USER=${DB_USER:-postgres}

echo "Enter database user password (leave empty if no password):"
read -s DB_PASSWORD

echo ""
echo "Setting up database..."

# Create database
psql -U "$SUPERUSER" -d postgres -c "CREATE DATABASE $DB_NAME;" 2>/dev/null || echo "Database $DB_NAME might already exist"

# Create user if it doesn't exist
if [ "$DB_USER" != "$SUPERUSER" ]; then
    if [ -z "$DB_PASSWORD" ]; then
        psql -U "$SUPERUSER" -d postgres -c "CREATE USER $DB_USER;" 2>/dev/null || echo "User $DB_USER might already exist"
    else
        psql -U "$SUPERUSER" -d postgres -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';" 2>/dev/null || echo "User $DB_USER might already exist"
    fi
fi

# Grant privileges
psql -U "$SUPERUSER" -d postgres -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;"
psql -U "$SUPERUSER" -d "$DB_NAME" -c "GRANT ALL ON SCHEMA public TO $DB_USER;"
psql -U "$SUPERUSER" -d "$DB_NAME" -c "GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO $DB_USER;"
psql -U "$SUPERUSER" -d "$DB_NAME" -c "GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO $DB_USER;"
psql -U "$SUPERUSER" -d "$DB_NAME" -c "ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO $DB_USER;"
psql -U "$SUPERUSER" -d "$DB_NAME" -c "ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO $DB_USER;"

echo ""
echo "Database setup complete!"
echo ""
echo "Update your .env.local file with:"
if [ -z "$DB_PASSWORD" ]; then
    echo "DATABASE_URL=\"postgresql://$DB_USER@localhost:5432/$DB_NAME?schema=public\""
else
    echo "DATABASE_URL=\"postgresql://$DB_USER:$DB_PASSWORD@localhost:5432/$DB_NAME?schema=public\""
fi

