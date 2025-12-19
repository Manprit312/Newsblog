-- Add photos column to news_blogs table
-- This script adds a photos column as text[] (array of strings) to store multiple photo URLs

ALTER TABLE news_blogs 
ADD COLUMN IF NOT EXISTS photos text[] DEFAULT '{}';

-- Create index for better query performance if needed
CREATE INDEX IF NOT EXISTS idx_news_blogs_photos ON news_blogs USING GIN (photos);



