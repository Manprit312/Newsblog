# Seed Sample Data and Create Admin

This guide will help you add sample data to your NewsBlogs database and create an admin user.

## Step 1: Add Sample Data

### Option A: Using SQL Script (Recommended)

**From your local machine, transfer the script:**
```bash
scp NewsBlogs/scripts/seed-sample-data.sql manprit@72.61.240.156:~/
```

**On the VPS, run it:**
```bash
# Connect to VPS
ssh manprit@72.61.240.156

# Run the seed script
psql -U postgres -d newsblogs -f ~/seed-sample-data.sql
```

### Option B: Manual SQL Commands

Connect to PostgreSQL on the VPS:
```bash
psql -U postgres -d newsblogs
```

Then paste the SQL from `scripts/seed-sample-data.sql` or use the commands below:

```sql
-- Insert sample categories
INSERT INTO categories (name, slug, description, active, order_index, created_at, updated_at)
VALUES
  ('National', 'national', 'National news and updates', true, 1, NOW(), NOW()),
  ('State', 'state', 'State-level news', true, 2, NOW(), NOW()),
  ('Politics', 'politics', 'Political news and analysis', true, 3, NOW(), NOW()),
  ('Business', 'business', 'Business and economy news', true, 4, NOW(), NOW()),
  ('Sports', 'sports', 'Sports news and updates', true, 5, NOW(), NOW()),
  ('Entertainment', 'entertainment', 'Entertainment and celebrity news', true, 6, NOW(), NOW()),
  ('Technology', 'technology', 'Technology and innovation news', true, 7, NOW(), NOW())
ON CONFLICT (slug) DO NOTHING;

-- Insert sample subcategories for National
INSERT INTO subcategories (name, slug, description, category_id, active, order_index, created_at, updated_at)
SELECT 
  'Breaking News',
  'breaking-news',
  'Latest breaking news',
  c.id,
  true,
  1,
  NOW(),
  NOW()
FROM categories c WHERE c.slug = 'national'
ON CONFLICT (category_id, slug) DO NOTHING;

INSERT INTO subcategories (name, slug, description, category_id, active, order_index, created_at, updated_at)
SELECT 
  'Trending News',
  'trending-news',
  'Trending stories',
  c.id,
  true,
  2,
  NOW(),
  NOW()
FROM categories c WHERE c.slug = 'national'
ON CONFLICT (category_id, slug) DO NOTHING;

-- Insert sample subcategories for State
INSERT INTO subcategories (name, slug, description, category_id, active, order_index, created_at, updated_at)
SELECT 
  'Uttar Pradesh',
  'uttar-pradesh',
  'Uttar Pradesh news',
  c.id,
  true,
  1,
  NOW(),
  NOW()
FROM categories c WHERE c.slug = 'state'
ON CONFLICT (category_id, slug) DO NOTHING;

-- Insert sample blogs
INSERT INTO news_blogs (title, slug, excerpt, content, featured_image, photos, tags, author, published, featured, views, category_id, subcategory_id, created_at, updated_at)
SELECT 
  'Sample Breaking News Article',
  'sample-breaking-news-article',
  'This is a sample breaking news article to demonstrate the NewsBlogs system.',
  '<h1>Sample Breaking News Article</h1><p>This is the content of a sample breaking news article.</p>',
  NULL,
  ARRAY[]::TEXT[],
  ARRAY['breaking', 'news', 'sample']::TEXT[],
  'Admin',
  true,
  true,
  0,
  c.id,
  s.id,
  NOW(),
  NOW()
FROM categories c
JOIN subcategories s ON s.category_id = c.id
WHERE c.slug = 'national' AND s.slug = 'breaking-news'
LIMIT 1;

-- Verify data
SELECT 'Categories:' as info, COUNT(*) as count FROM categories;
SELECT 'Subcategories:' as info, COUNT(*) as count FROM subcategories;
SELECT 'Blogs:' as info, COUNT(*) as count FROM news_blogs;
```

## Step 2: Create Admin User

### Option A: Using the Script (Recommended)

**From your NewsBlogs project directory:**

```bash
cd NewsBlogs

# Make sure your .env file has the correct DATABASE_URL
# DATABASE_URL="postgresql://postgres:manprit%2A@72.61.240.156:5432/newsblogs"

# Install dependencies if not already done
npm install

# Create admin with default credentials
npm run create-admin

# Or create admin with custom credentials
node scripts/create-admin.js admin@newsblogs.com admin123 "Admin User" admin admin
```

**Default credentials:**
- Email: `admin@example.com`
- Password: `admin123`
- Username: `admin`
- Role: `admin`

### Option B: Custom Admin Creation

```bash
node scripts/create-admin.js <email> <password> <name> <username> <role>
```

Example:
```bash
node scripts/create-admin.js admin@newsblogs.com MySecurePass123 "NewsBlogs Admin" newsadmin admin
```

### Option C: Manual SQL (if admins table exists)

**Note:** The `admins` table is shared with geneveda-biosciences. If it doesn't exist, you may need to set up the geneveda database first.

```sql
-- Connect to PostgreSQL
psql -U postgres -d newsblogs

-- Hash password using bcrypt (you'll need to use Node.js for this)
-- Better to use the script above
```

## Step 3: Verify Everything

### Check Data

```bash
# Connect to database
psql -U postgres -d newsblogs

# Check categories
SELECT * FROM categories;

# Check subcategories
SELECT s.name, s.slug, c.name as category FROM subcategories s JOIN categories c ON s.category_id = c.id;

# Check blogs
SELECT id, title, slug, published, featured FROM news_blogs;

# Check admin (if admins table exists)
SELECT username, email, role, active FROM admins;
```

### Test Admin Login

1. Start your NewsBlogs application:
```bash
cd NewsBlogs
npm run dev
```

2. Navigate to: `http://localhost:3000/admin/login`

3. Login with your admin credentials

## Sample Data Summary

After running the seed script, you'll have:

- **7 Categories:**
  - National
  - State
  - Politics
  - Business
  - Sports
  - Entertainment
  - Technology

- **5 Subcategories:**
  - Breaking News (under National)
  - Trending News (under National)
  - Uttar Pradesh (under State)
  - Delhi NCR (under State)
  - Elections (under Politics)
  - Markets (under Business)

- **4 Sample Blogs:**
  - Sample Breaking News Article (featured)
  - State News Update
  - Political Analysis: Current Affairs
  - Business Market Update (featured)

## Troubleshooting

### Admin Creation Fails

If you get an error about the `admins` table not existing:

1. The `admins` table is shared with geneveda-biosciences
2. You may need to create it first or use the same database
3. Check if the table exists:
   ```sql
   SELECT * FROM information_schema.tables WHERE table_name = 'admins';
   ```

### Data Not Inserting

- Check for conflicts (duplicate slugs)
- Verify foreign key relationships
- Check PostgreSQL logs for errors

### Connection Issues

- Verify DATABASE_URL in .env file
- Test connection: `psql "postgresql://postgres:manprit%2A@72.61.240.156:5432/newsblogs" -c "\dt"`
- Check firewall settings on VPS

## Next Steps

1. ✅ Database created
2. ✅ Tables created
3. ✅ Sample data added
4. ✅ Admin user created
5. 🚀 Start using the admin panel!

