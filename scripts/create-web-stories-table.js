const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function createWebStoriesTable() {
  try {
    console.log('Creating web_stories table...');
    
    // Create table
    await prisma.$executeRawUnsafe(`
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
      )
    `);
    console.log('✅ Table created');

    // Create indexes
    await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS idx_web_stories_slug ON web_stories(slug)`);
    await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS idx_web_stories_published ON web_stories(published)`);
    await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS idx_web_stories_category_id ON web_stories(category_id)`);
    await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS idx_web_stories_subcategory_id ON web_stories(subcategory_id)`);
    await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS idx_web_stories_created_at ON web_stories(created_at DESC)`);
    console.log('✅ Indexes created');

    // Add comments
    try {
      await prisma.$executeRawUnsafe(`COMMENT ON TABLE web_stories IS 'Web Stories for NewsBlogs - Google Web Stories format'`);
      await prisma.$executeRawUnsafe(`COMMENT ON COLUMN web_stories.pages IS 'JSON array of story pages with title, text, and image fields'`);
      console.log('✅ Comments added');
    } catch (commentError) {
      // Comments might fail if user doesn't have permission, but that's okay
      console.log('⚠️  Could not add comments (non-critical)');
    }
    
    console.log('✅ web_stories table created successfully!');
  } catch (error) {
    console.error('❌ Error creating web_stories table:', error);
    if (error.code === '42P01' || error.meta?.code === '42P01') {
      console.error('One of the referenced tables (categories or subcategories) does not exist.');
    }
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

createWebStoriesTable();

