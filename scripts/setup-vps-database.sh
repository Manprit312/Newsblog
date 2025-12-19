#!/bin/bash

# NewsBlogs Database Setup Script for VPS
# Run this script ON THE VPS after SSH connection

set -e

echo "=========================================="
echo "NewsBlogs Database Setup on VPS"
echo "=========================================="

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo -e "${RED}PostgreSQL is not installed. Please install it first.${NC}"
    echo "Install with: sudo apt install postgresql postgresql-contrib"
    exit 1
fi

# Get database connection details
echo ""
read -p "Enter PostgreSQL database name (default: newsblogs): " DB_NAME
DB_NAME=${DB_NAME:-newsblogs}

read -p "Enter PostgreSQL username (default: postgres): " DB_USER
DB_USER=${DB_USER:-postgres}

read -sp "Enter PostgreSQL password: " DB_PASS
echo ""

# Set PGPASSWORD environment variable
export PGPASSWORD=$DB_PASS

# Create database if it doesn't exist
echo -e "${YELLOW}Creating database '$DB_NAME' if it doesn't exist...${NC}"
psql -U "$DB_USER" -h localhost -c "CREATE DATABASE $DB_NAME;" 2>/dev/null || echo "Database already exists or error occurred."

# Check if SQL file exists
SQL_FILE="$(dirname "$0")/create-newsblogs-tables.sql"
if [ ! -f "$SQL_FILE" ]; then
    echo -e "${YELLOW}SQL file not found. Creating tables manually...${NC}"
    
    # Create tables directly
    psql -U "$DB_USER" -h localhost -d "$DB_NAME" <<EOF
-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  image VARCHAR(1000),
  order_index INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_active ON categories(active);
CREATE INDEX IF NOT EXISTS idx_categories_order ON categories(order_index);

-- Create subcategories table
CREATE TABLE IF NOT EXISTS subcategories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  description TEXT,
  image VARCHAR(1000),
  order_index INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(category_id, slug)
);

CREATE INDEX IF NOT EXISTS idx_subcategories_category_id ON subcategories(category_id);
CREATE INDEX IF NOT EXISTS idx_subcategories_slug ON subcategories(slug);
CREATE INDEX IF NOT EXISTS idx_subcategories_active ON subcategories(active);
CREATE INDEX IF NOT EXISTS idx_subcategories_order ON subcategories(order_index);

-- Create news_blogs table
CREATE TABLE IF NOT EXISTS news_blogs (
  id SERIAL PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  slug VARCHAR(500) UNIQUE NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  featured_image VARCHAR(1000),
  photos TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  author VARCHAR(255) DEFAULT 'Admin',
  published BOOLEAN DEFAULT false,
  featured BOOLEAN DEFAULT false,
  views INTEGER DEFAULT 0,
  category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  subcategory_id INTEGER REFERENCES subcategories(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_news_blogs_category_id ON news_blogs(category_id);
CREATE INDEX IF NOT EXISTS idx_news_blogs_subcategory_id ON news_blogs(subcategory_id);
CREATE INDEX IF NOT EXISTS idx_news_blogs_published ON news_blogs(published);
CREATE INDEX IF NOT EXISTS idx_news_blogs_slug ON news_blogs(slug);

-- Create trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subcategories_updated_at BEFORE UPDATE ON subcategories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_news_blogs_updated_at BEFORE UPDATE ON news_blogs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
EOF
else
    # Run the SQL script
    echo -e "${YELLOW}Creating tables from SQL file...${NC}"
    psql -U "$DB_USER" -h localhost -d "$DB_NAME" -f "$SQL_FILE"
fi

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✓ Database setup completed successfully!${NC}"
    echo ""
    echo "=========================================="
    echo "Database Connection String:"
    echo "=========================================="
    echo "DATABASE_URL=\"postgresql://$DB_USER:$DB_PASS@72.61.240.156:5432/$DB_NAME\""
    echo ""
    echo "Or if connecting from local machine:"
    echo "DATABASE_URL=\"postgresql://$DB_USER:$DB_PASS@72.61.240.156:5432/$DB_NAME\""
    echo ""
    echo "Next steps:"
    echo "1. Update your .env file with the DATABASE_URL above"
    echo "2. Make sure PostgreSQL allows remote connections (if needed)"
    echo "3. Run 'npm run prisma:generate' to generate Prisma client"
    echo "4. Create an admin user with 'npm run create-admin'"
else
    echo -e "${RED}✗ Database setup failed. Please check the error messages above.${NC}"
    exit 1
fi

# Unset password
unset PGPASSWORD
