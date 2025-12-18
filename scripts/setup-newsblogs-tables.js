require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function setupTables() {
  try {
    console.log('📋 Setting up NewsBlogs tables...');

    // Step 1: Create categories table
    console.log('Creating categories table...');
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        description TEXT,
        order_index INTEGER DEFAULT 0,
        active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Step 2: Create indexes for categories
    await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug)`);
    await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS idx_categories_active ON categories(active)`);
    await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS idx_categories_order ON categories(order_index)`);

    // Step 3: Create subcategories table
    console.log('Creating subcategories table...');
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS subcategories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL,
        description TEXT,
        order_index INTEGER DEFAULT 0,
        active BOOLEAN DEFAULT true,
        category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(category_id, slug)
      )
    `);

    // Step 4: Create indexes for subcategories
    await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS idx_subcategories_category_id ON subcategories(category_id)`);
    await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS idx_subcategories_slug ON subcategories(slug)`);
    await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS idx_subcategories_active ON subcategories(active)`);
    await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS idx_subcategories_order ON subcategories(order_index)`);

    // Step 5: Create news_blogs table
    console.log('Creating news_blogs table...');
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS news_blogs (
        id SERIAL PRIMARY KEY,
        title VARCHAR(500) NOT NULL,
        slug VARCHAR(500) UNIQUE NOT NULL,
        excerpt TEXT NOT NULL,
        content TEXT NOT NULL,
        featured_image VARCHAR(1000),
        tags TEXT[] DEFAULT '{}',
        author VARCHAR(255) DEFAULT 'Admin',
        published BOOLEAN DEFAULT false,
        featured BOOLEAN DEFAULT false,
        views INTEGER DEFAULT 0,
        category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
        subcategory_id INTEGER REFERENCES subcategories(id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Step 6: Create indexes for news_blogs
    await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS idx_news_blogs_category_id ON news_blogs(category_id)`);
    await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS idx_news_blogs_subcategory_id ON news_blogs(subcategory_id)`);
    await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS idx_news_blogs_published ON news_blogs(published)`);
    await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS idx_news_blogs_slug ON news_blogs(slug)`);

    // Step 7: Create trigger function
    console.log('Creating trigger function...');
    await prisma.$executeRawUnsafe(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $trigger$
      BEGIN
          NEW.updated_at = NOW();
          RETURN NEW;
      END;
      $trigger$ language 'plpgsql'
    `);

    // Step 8: Create triggers
    try {
      await prisma.$executeRawUnsafe(`DROP TRIGGER IF EXISTS update_categories_updated_at ON categories`);
    } catch (e) {}
    await prisma.$executeRawUnsafe(`
      CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
          FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()
    `);

    try {
      await prisma.$executeRawUnsafe(`DROP TRIGGER IF EXISTS update_subcategories_updated_at ON subcategories`);
    } catch (e) {}
    await prisma.$executeRawUnsafe(`
      CREATE TRIGGER update_subcategories_updated_at BEFORE UPDATE ON subcategories
          FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()
    `);

    try {
      await prisma.$executeRawUnsafe(`DROP TRIGGER IF EXISTS update_news_blogs_updated_at ON news_blogs`);
    } catch (e) {}
    await prisma.$executeRawUnsafe(`
      CREATE TRIGGER update_news_blogs_updated_at BEFORE UPDATE ON news_blogs
          FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()
    `);

    console.log('✅ NewsBlogs tables setup completed!');
    console.log('\n📋 Created tables:');
    console.log('  - categories');
    console.log('  - subcategories');
    console.log('  - news_blogs');
    console.log('\nYou can now use the admin panel to manage categories and blogs.');

  } catch (error) {
    console.error('❌ Failed to setup tables:', error.message);
    if (error.code === '42P07') {
      console.log('ℹ️  Some tables already exist, that\'s okay!');
    } else {
      process.exit(1);
    }
  } finally {
    await prisma.$disconnect();
  }
}

setupTables();
