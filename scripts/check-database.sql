-- Check Database Tables and Data
-- Run this on the VPS: psql -U postgres -d newsblogs -f check-database.sql

-- List all tables
\dt

-- Check categories table structure
\d categories

-- Check subcategories table structure
\d subcategories

-- Check news_blogs table structure
\d news_blogs

-- Count records in each table
SELECT 'categories' as table_name, COUNT(*) as count FROM categories
UNION ALL
SELECT 'subcategories' as table_name, COUNT(*) as count FROM subcategories
UNION ALL
SELECT 'news_blogs' as table_name, COUNT(*) as count FROM news_blogs;

-- View all categories
SELECT * FROM categories ORDER BY id;

-- View all subcategories
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

-- View all blogs (with basic info)
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
ORDER BY created_at DESC
LIMIT 10;

-- View full blog details (first blog)
SELECT * FROM news_blogs LIMIT 1;

-- Check if photos field exists and has data
SELECT 
    id,
    title,
    array_length(photos, 1) as photo_count,
    photos
FROM news_blogs
WHERE array_length(photos, 1) > 0
LIMIT 5;





