# NewsBlogs VPS Live Database Setup

This guide will help you set up the NewsBlogs database on your VPS and connect to it from your application.

## Prerequisites
- SSH access to VPS: `manprit@72.61.240.156`
- PostgreSQL installed on the VPS
- Password: `manprit*`

## Step 1: Connect to VPS via SSH

```bash
ssh manprit@72.61.240.156
# Enter password when prompted: manprit*
```

## Step 2: Transfer Setup Files to VPS

From your **local machine** (in the NewsBlogs directory):

```bash
# Transfer SQL file
scp scripts/create-newsblogs-tables.sql manprit@72.61.240.156:~/

# Transfer setup script (optional)
scp scripts/setup-vps-database.sh manprit@72.61.240.156:~/
```

## Step 3: Run Database Setup on VPS

Once connected to the VPS via SSH, you have two options:

### Option A: Use the Setup Script (Recommended)

```bash
# Make script executable
chmod +x ~/setup-vps-database.sh

# Run the script
~/setup-vps-database.sh
```

The script will:
- Ask for database name (default: `newsblogs`)
- Ask for PostgreSQL username (default: `postgres`)
- Ask for PostgreSQL password
- Create the database
- Create all tables with indexes and triggers

### Option B: Manual Setup

```bash
# Connect to PostgreSQL
sudo -u postgres psql
```

Then run these SQL commands:

```sql
-- Create database
CREATE DATABASE newsblogs;

-- Connect to the database
\c newsblogs

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

-- Verify tables
\dt

-- Exit
\q
```

## Step 4: Configure PostgreSQL for Remote Access (If Needed)

If you need to connect from outside the VPS, you may need to configure PostgreSQL:

### Edit PostgreSQL Config

```bash
# Find PostgreSQL config file location
sudo find /etc -name postgresql.conf 2>/dev/null

# Usually located at:
sudo nano /etc/postgresql/*/main/postgresql.conf
```

Find and uncomment/modify:
```
listen_addresses = '*'  # or 'localhost' if only local access
```

### Edit pg_hba.conf

```bash
sudo nano /etc/postgresql/*/main/pg_hba.conf
```

Add this line (adjust IP range as needed):
```
host    all             all             0.0.0.0/0               md5
```

### Restart PostgreSQL

```bash
sudo systemctl restart postgresql
```

### Open Firewall Port (if using firewall)

```bash
# Ubuntu/Debian (ufw)
sudo ufw allow 5432/tcp

# CentOS/RHEL (firewalld)
sudo firewall-cmd --permanent --add-port=5432/tcp
sudo firewall-cmd --reload
```

## Step 5: Update Your Application .env File

Update your `.env` file in the NewsBlogs project with the VPS database connection:

```env
# For connection from VPS itself
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/newsblogs"

# For connection from local machine or other servers
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@72.61.240.156:5432/newsblogs"
```

**Important:** Replace `YOUR_PASSWORD` with your actual PostgreSQL password.

## Step 6: Test Connection

From your local machine or VPS:

```bash
# Test connection
psql "postgresql://postgres:YOUR_PASSWORD@72.61.240.156:5432/newsblogs" -c "\dt"
```

You should see: `categories`, `subcategories`, `news_blogs`

## Step 7: Generate Prisma Client

In your NewsBlogs project directory:

```bash
npm install
npx prisma generate
```

## Step 8: Create Admin User

```bash
npm run create-admin
```

## Verify Database Setup

```bash
# Connect to database
psql "postgresql://postgres:YOUR_PASSWORD@72.61.240.156:5432/newsblogs"

# List tables
\dt

# Check categories table structure
\d categories

# Check news_blogs table structure
\d news_blogs

# Exit
\q
```

## Troubleshooting

### Connection Refused
- Check if PostgreSQL is running: `sudo systemctl status postgresql`
- Check firewall settings
- Verify `listen_addresses` in postgresql.conf

### Authentication Failed
- Check `pg_hba.conf` settings
- Verify username and password
- Try connecting as `postgres` user first

### Database Not Found
- Verify database was created: `psql -U postgres -l`
- Check database name spelling

### Permission Denied
- Ensure PostgreSQL user has proper permissions
- Check file permissions on SQL script

## Security Notes

1. **Use Strong Passwords**: Don't use default passwords in production
2. **Limit Access**: Only allow connections from trusted IPs in `pg_hba.conf`
3. **Use SSL**: Enable SSL connections for production
4. **Environment Variables**: Never commit `.env` files with passwords

## Next Steps

1. ✅ Database created on VPS
2. ✅ Tables created
3. ✅ Connection string configured
4. ✅ Prisma client generated
5. ✅ Admin user created
6. 🚀 Deploy your application!

