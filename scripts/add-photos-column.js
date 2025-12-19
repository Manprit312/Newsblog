require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function addPhotosColumn() {
  try {
    console.log('Adding photos column to news_blogs table...');
    
    // Add photos column if it doesn't exist
    await prisma.$executeRaw`
      ALTER TABLE news_blogs 
      ADD COLUMN IF NOT EXISTS photos text[] DEFAULT '{}'
    `;
    
    console.log('✅ Photos column added successfully!');
    
    // Create index if it doesn't exist
    try {
      await prisma.$executeRaw`
        CREATE INDEX IF NOT EXISTS idx_news_blogs_photos ON news_blogs USING GIN (photos)
      `;
      console.log('✅ Index created successfully!');
    } catch (indexError) {
      console.log('⚠️  Index might already exist, continuing...');
    }
    
    console.log('\n✅ Migration completed successfully!');
    console.log('You can now use the photos field in your blogs.');
    
  } catch (error) {
    console.error('❌ Error adding photos column:', error.message);
    if (error.message.includes('already exists')) {
      console.log('✅ Column already exists, no action needed.');
    } else {
      process.exit(1);
    }
  } finally {
    await prisma.$disconnect();
  }
}

addPhotosColumn();



