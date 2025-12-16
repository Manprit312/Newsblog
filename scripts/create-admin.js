require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

// Create database connection
function getPoolConfig() {
  let connectionString = process.env.DATABASE_URL;
  
  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not set');
  }

  const isLocalhost = connectionString.includes('localhost') || 
                      connectionString.includes('127.0.0.1') ||
                      connectionString.includes('::1');

  connectionString = connectionString.replace(/[?&]sslmode=[^&]*/g, '');

  const config = {
    connectionString,
  };

  if (!isLocalhost) {
    config.ssl = {
      rejectUnauthorized: false
    };
  } else {
    config.ssl = false;
  }

  return config;
}

const pool = new Pool(getPoolConfig());

async function query(text, params) {
  const res = await pool.query(text, params);
  return res;
}

async function createAdmin() {
  try {
    // Get email and password from command line arguments or use defaults
    const email = process.argv[2] || 'admin@example.com';
    const password = process.argv[3] || 'admin123';
    const name = process.argv[4] || 'Admin User';

    console.log(`Creating admin user with email: ${email}`);
    
    // Check if user already exists
    const existingUser = await query('SELECT id FROM "User" WHERE email = $1', [email]);
    
    if (existingUser.rows.length > 0) {
      console.log(`⚠ User with email ${email} already exists!`);
      console.log('To update the password, delete the user first or use a different email.');
      await pool.end();
      process.exit(1);
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Insert the admin user
    const result = await query(
      `INSERT INTO "User" (email, password, name, role, "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
       RETURNING id, email, name, role`,
      [email, hashedPassword, name, 'admin']
    );

    const user = result.rows[0];
    
    console.log('✅ Admin user created successfully!');
    console.log('\nAdmin Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Email:    ${user.email}`);
    console.log(`Password:  ${password}`);
    console.log(`Name:      ${user.name}`);
    console.log(`Role:      ${user.role}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n⚠️  Please save these credentials securely!');
    console.log('You can now login at /admin/login');
    
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to create admin user:', error.message);
    await pool.end();
    process.exit(1);
  }
}

createAdmin();

