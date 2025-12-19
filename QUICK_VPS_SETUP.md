# Quick VPS Database Setup

## Option 1: Manual Setup (Recommended)

### Step 1: Connect to VPS
```bash
ssh manprit@72.61.240.156
# Password: manprit*
```

### Step 2: Copy and paste the SQL commands below

Once connected, run these commands:

```bash
# Connect to PostgreSQL
sudo -u postgres psql
```

Then paste this SQL:

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

### Step 3: Update your .env file

On the VPS, in your NewsBlogs project directory, update `.env`:

```env
DATABASE_URL="postgresql://postgres:manprit*@localhost:5432/newsblogs"
```

(Replace `manprit*` with your actual PostgreSQL password if different)

### Step 4: Generate Prisma Client

```bash
cd /path/to/NewsBlogs
npm install
npx prisma generate
```

### Step 5: Create Admin User

```bash
npm run create-admin
```

## Option 2: Using SQL File

If you can transfer the file:

1. On your local machine:
```bash
scp scripts/create-newsblogs-tables.sql manprit@72.61.240.156:~/
```

2. On VPS:
```bash
# Create database first
sudo -u postgres psql -c "CREATE DATABASE newsblogs;"

# Run SQL file
sudo -u postgres psql -d newsblogs -f ~/create-newsblogs-tables.sql
```

## Verify Setup

```bash
psql -U postgres -d newsblogs -c "\dt"
```

You should see: `categories`, `subcategories`, `news_blogs`

