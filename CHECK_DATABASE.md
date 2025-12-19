# Check Database Tables and Data

## Quick Check Commands

### Option 1: Connect via SSH and run commands

```bash
# Connect to VPS
ssh manprit@72.61.240.156

# Connect to PostgreSQL
psql -U postgres -d newsblogs
```

Then run these SQL commands:

```sql
-- List all tables
\dt

-- Count records in each table
SELECT 'categories' as table_name, COUNT(*) as count FROM categories
UNION ALL
SELECT 'subcategories' as table_name, COUNT(*) as count FROM subcategories
UNION ALL
SELECT 'news_blogs' as table_name, COUNT(*) as count FROM news_blogs;

-- View all categories
SELECT * FROM categories ORDER BY id;

-- View all subcategories with category names
SELECT 
    s.id,
    s.name,
    s.slug,
    c.name as category_name,
    s.active,
    s.created_at
FROM subcategories s
LEFT JOIN categories c ON s.category_id = c.id
ORDER BY s.id;

-- View all blogs (summary)
SELECT 
    id,
    title,
    slug,
    published,
    featured,
    views,
    category_id,
    subcategory_id,
    created_at
FROM news_blogs
ORDER BY created_at DESC;

-- Check table structures
\d categories
\d subcategories
\d news_blogs

-- Exit
\q
```

### Option 2: Run from local machine

```bash
# Test connection and list tables
psql "postgresql://postgres:manprit%2A@72.61.240.156:5432/newsblogs" -c "\dt"

# Count records
psql "postgresql://postgres:manprit%2A@72.61.240.156:5432/newsblogs" -c "SELECT 'categories' as table_name, COUNT(*) as count FROM categories UNION ALL SELECT 'subcategories', COUNT(*) FROM subcategories UNION ALL SELECT 'news_blogs', COUNT(*) FROM news_blogs;"

# View categories
psql "postgresql://postgres:manprit%2A@72.61.240.156:5432/newsblogs" -c "SELECT * FROM categories;"

# View subcategories
psql "postgresql://postgres:manprit%2A@72.61.240.156:5432/newsblogs" -c "SELECT s.id, s.name, s.slug, c.name as category_name FROM subcategories s LEFT JOIN categories c ON s.category_id = c.id;"

# View blogs
psql "postgresql://postgres:manprit%2A@72.61.240.156:5432/newsblogs" -c "SELECT id, title, slug, published, featured, views FROM news_blogs ORDER BY created_at DESC LIMIT 10;"
```

### Option 3: Use the SQL script

```bash
# Transfer script to VPS
scp scripts/check-database.sql manprit@72.61.240.156:~/

# On VPS, run it
psql -U postgres -d newsblogs -f ~/check-database.sql
```

## Expected Output

After running the setup, you should see:

1. **Tables exist:**
   - `categories`
   - `subcategories`
   - `news_blogs`

2. **Initial counts:**
   - categories: 0
   - subcategories: 0
   - news_blogs: 0

3. **Table structures:**
   - All columns should match the schema
   - Indexes should be created
   - Triggers should be active

## Common Queries

### Check if photos field works
```sql
SELECT id, title, photos, array_length(photos, 1) as photo_count 
FROM news_blogs 
WHERE array_length(photos, 1) > 0;
```

### Check categories with images
```sql
SELECT id, name, slug, image, active 
FROM categories 
WHERE image IS NOT NULL;
```

### Check recent blogs
```sql
SELECT 
    id,
    title,
    slug,
    published,
    featured,
    views,
    created_at
FROM news_blogs
ORDER BY created_at DESC
LIMIT 10;
```



