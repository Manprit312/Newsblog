-- Create User table
CREATE TABLE IF NOT EXISTS "User" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'admin',
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS "User_email_idx" ON "User"(email);

-- Create Blog table
CREATE TABLE IF NOT EXISTS "Blog" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    excerpt VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    "featuredImage" VARCHAR(500) NOT NULL,
    category VARCHAR(100) DEFAULT 'General',
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    author VARCHAR(255) DEFAULT 'Admin',
    published BOOLEAN DEFAULT false,
    featured BOOLEAN DEFAULT false,
    views INTEGER DEFAULT 0,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes on Blog table
CREATE INDEX IF NOT EXISTS "Blog_slug_idx" ON "Blog"(slug);
CREATE INDEX IF NOT EXISTS "Blog_published_idx" ON "Blog"(published);
CREATE INDEX IF NOT EXISTS "Blog_category_idx" ON "Blog"(category);

-- Create function to automatically update updatedAt timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updatedAt
CREATE TRIGGER update_user_updated_at BEFORE UPDATE ON "User"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_updated_at BEFORE UPDATE ON "Blog"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();




