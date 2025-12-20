-- Create web_stories table for NewsBlogs
-- Run this migration to create the web_stories table

CREATE TABLE IF NOT EXISTS web_stories (
  id SERIAL PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  slug VARCHAR(500) UNIQUE NOT NULL,
  excerpt TEXT,
  cover_image VARCHAR(1000),
  pages JSONB DEFAULT '[]'::jsonb,
  author VARCHAR(255) DEFAULT 'Admin',
  published BOOLEAN DEFAULT false,
  featured BOOLEAN DEFAULT false,
  views INTEGER DEFAULT 0,
  category_id INTEGER,
  subcategory_id INTEGER,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  CONSTRAINT fk_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
  CONSTRAINT fk_subcategory FOREIGN KEY (subcategory_id) REFERENCES subcategories(id) ON DELETE SET NULL
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_web_stories_slug ON web_stories(slug);
CREATE INDEX IF NOT EXISTS idx_web_stories_published ON web_stories(published);
CREATE INDEX IF NOT EXISTS idx_web_stories_category_id ON web_stories(category_id);
CREATE INDEX IF NOT EXISTS idx_web_stories_subcategory_id ON web_stories(subcategory_id);
CREATE INDEX IF NOT EXISTS idx_web_stories_created_at ON web_stories(created_at DESC);

-- Add comments
COMMENT ON TABLE web_stories IS 'Web Stories for NewsBlogs - Google Web Stories format';
COMMENT ON COLUMN web_stories.pages IS 'JSON array of story pages with title, text, and image fields';

