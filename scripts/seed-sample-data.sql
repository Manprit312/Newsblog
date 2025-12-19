-- Seed Sample Data for NewsBlogs
-- Run this on the VPS: psql -U postgres -d newsblogs -f seed-sample-data.sql

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

-- Insert sample subcategories
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

INSERT INTO subcategories (name, slug, description, category_id, active, order_index, created_at, updated_at)
SELECT 
  'Delhi NCR',
  'delhi-ncr',
  'Delhi NCR news',
  c.id,
  true,
  2,
  NOW(),
  NOW()
FROM categories c WHERE c.slug = 'state'
ON CONFLICT (category_id, slug) DO NOTHING;

INSERT INTO subcategories (name, slug, description, category_id, active, order_index, created_at, updated_at)
SELECT 
  'Elections',
  'elections',
  'Election news and updates',
  c.id,
  true,
  1,
  NOW(),
  NOW()
FROM categories c WHERE c.slug = 'politics'
ON CONFLICT (category_id, slug) DO NOTHING;

INSERT INTO subcategories (name, slug, description, category_id, active, order_index, created_at, updated_at)
SELECT 
  'Markets',
  'markets',
  'Stock market and financial news',
  c.id,
  true,
  1,
  NOW(),
  NOW()
FROM categories c WHERE c.slug = 'business'
ON CONFLICT (category_id, slug) DO NOTHING;

-- Insert sample blogs
INSERT INTO news_blogs (title, slug, excerpt, content, featured_image, photos, tags, author, published, featured, views, category_id, subcategory_id, created_at, updated_at)
SELECT 
  'Sample Breaking News Article',
  'sample-breaking-news-article',
  'This is a sample breaking news article to demonstrate the NewsBlogs system.',
  '<h1>Sample Breaking News Article</h1><p>This is the content of a sample breaking news article. You can edit this content using the rich text editor in the admin panel.</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>',
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

INSERT INTO news_blogs (title, slug, excerpt, content, featured_image, photos, tags, author, published, featured, views, category_id, subcategory_id, created_at, updated_at)
SELECT 
  'State News Update',
  'state-news-update',
  'Latest updates from the state government and local news.',
  '<h1>State News Update</h1><p>This is a sample state news article. It demonstrates how state-level news can be organized and displayed.</p><p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>',
  NULL,
  ARRAY[]::TEXT[],
  ARRAY['state', 'government', 'local']::TEXT[],
  'Admin',
  true,
  false,
  0,
  c.id,
  s.id,
  NOW(),
  NOW()
FROM categories c
JOIN subcategories s ON s.category_id = c.id
WHERE c.slug = 'state' AND s.slug = 'uttar-pradesh'
LIMIT 1;

INSERT INTO news_blogs (title, slug, excerpt, content, featured_image, photos, tags, author, published, featured, views, category_id, subcategory_id, created_at, updated_at)
SELECT 
  'Political Analysis: Current Affairs',
  'political-analysis-current-affairs',
  'In-depth analysis of current political developments and their implications.',
  '<h1>Political Analysis</h1><p>This article provides an in-depth analysis of current political developments.</p><p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>',
  NULL,
  ARRAY[]::TEXT[],
  ARRAY['politics', 'analysis', 'current-affairs']::TEXT[],
  'Admin',
  true,
  false,
  0,
  c.id,
  NULL,
  NOW(),
  NOW()
FROM categories c
WHERE c.slug = 'politics'
LIMIT 1;

INSERT INTO news_blogs (title, slug, excerpt, content, featured_image, photos, tags, author, published, featured, views, category_id, subcategory_id, created_at, updated_at)
SELECT 
  'Business Market Update',
  'business-market-update',
  'Latest updates from the business and financial markets.',
  '<h1>Business Market Update</h1><p>Stay updated with the latest business and market news.</p><p>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>',
  NULL,
  ARRAY[]::TEXT[],
  ARRAY['business', 'markets', 'finance']::TEXT[],
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
WHERE c.slug = 'business' AND s.slug = 'markets'
LIMIT 1;

-- Display summary
SELECT 'Sample data inserted successfully!' as message;
SELECT 'Categories:' as info, COUNT(*) as count FROM categories;
SELECT 'Subcategories:' as info, COUNT(*) as count FROM subcategories;
SELECT 'Blogs:' as info, COUNT(*) as count FROM news_blogs;



