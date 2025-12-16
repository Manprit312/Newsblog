require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });
const { MongoClient, ObjectId } = require('mongodb');
const bcrypt = require('bcryptjs');

// Create database connection
async function getDatabase() {
  let connectionString = process.env.DATABASE_URL;
  
  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not set');
  }

  // Replace <db_password> placeholder if present
  const finalConnectionString = connectionString.replace('<db_password>', process.env.DB_PASSWORD || '');

  const client = new MongoClient(finalConnectionString, {
    serverSelectionTimeoutMS: 30000,
    connectTimeoutMS: 15000,
  });

  await client.connect();
  return client.db();
}

async function createAdmin() {
  let client;
  try {
    // Get email and password from command line arguments or use defaults
    const email = process.argv[2] || 'admin@example.com';
    const password = process.argv[3] || 'admin123';
    const name = process.argv[4] || 'Admin User';

    console.log(`Creating admin user with email: ${email}`);
    
    const db = await getDatabase();
    const usersCollection = db.collection('users');
    
    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email });
    
    if (existingUser) {
      console.log(`⚠ User with email ${email} already exists!`);
      console.log('To update the password, delete the user first or use a different email.');
      process.exit(1);
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Insert the admin user
    const now = new Date();
    const result = await usersCollection.insertOne({
      email,
      password: hashedPassword,
      name,
      role: 'admin',
      createdAt: now,
      updatedAt: now,
    });

    console.log('✅ Admin user created successfully!');
    console.log('\nAdmin Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Email:    ${email}`);
    console.log(`Password: ${password}`);
    console.log(`Name:     ${name}`);
    console.log(`Role:     admin`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n⚠️  Please save these credentials securely!');
    console.log('You can now login at /admin/login');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to create admin user:', error.message);
    process.exit(1);
  } finally {
    if (client) {
      await client.close();
    }
  }
}

createAdmin();
