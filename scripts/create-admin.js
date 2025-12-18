require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    // Get email, password, name, username, and role from command line arguments or use defaults
    const email = process.argv[2] || 'admin@example.com';
    const password = process.argv[3] || 'admin123';
    const name = process.argv[4] || 'Admin User';
    const username = process.argv[5] || email.split('@')[0]; // Use email prefix as default username
    const role = process.argv[6] || 'admin'; // admin or superadmin

    console.log(`Creating admin user with email: ${email}`);

    // First, check if the admins table exists
    try {
      await prisma.$queryRaw`SELECT 1 FROM admins LIMIT 1`;
    } catch (error) {
      if (error.message && error.message.includes('does not exist')) {
        console.error('❌ Error: The "admins" table does not exist.');
        console.error('\n📋 Setup Instructions:');
        console.error('1. First, set up the geneveda-biosciences database schema:');
        console.error('   cd ../geneveda-biosciences');
        console.error('   npm run prisma:push');
        console.error('2. Then come back and run this script again.');
        console.error('\nSee SETUP_DATABASE.md for detailed instructions.');
        process.exit(1);
      }
      throw error;
    }

    // Check if user already exists (using raw SQL since Admin model is not in this schema)
    const existingUser = await prisma.$queryRaw`
      SELECT id, email, username FROM admins WHERE email = ${email} OR username = ${username}
    `;

    if (existingUser && existingUser.length > 0) {
      console.log(`⚠ User with email ${email} or username ${username} already exists!`);
      console.log('To update the password, delete the user first or use a different email/username.');
      process.exit(1);
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Validate role
    if (role !== 'admin' && role !== 'superadmin') {
      console.error('❌ Invalid role. Role must be "admin" or "superadmin"');
      process.exit(1);
    }

    // Insert the admin user using raw SQL (since Admin model is in geneveda schema)
    // The enum type is "AdminRole" - we need to cast the role string to this enum
    try {
      await prisma.$executeRawUnsafe(
        `INSERT INTO admins (username, email, password_hash, name, role, active, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5::\"AdminRole\", true, NOW(), NOW())`,
        username,
        email,
        hashedPassword,
        name,
        role
      );
    } catch (error) {
      // If the quoted enum doesn't work, try without quotes
      try {
        await prisma.$executeRawUnsafe(
          `INSERT INTO admins (username, email, password_hash, name, role, active, created_at, updated_at)
           VALUES ($1, $2, $3, $4, CAST($5 AS \"AdminRole\"), true, NOW(), NOW())`,
          username,
          email,
          hashedPassword,
          name,
          role
        );
      } catch (error2) {
        console.error('Failed with AdminRole enum, trying alternative...');
        throw error2;
      }
    }

    console.log('✅ Admin user created successfully!');
    console.log('\nAdmin Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Username: ${username}`);
    console.log(`Email:    ${email}`);
    console.log(`Password: ${password}`);
    console.log(`Name:     ${name}`);
    console.log(`Role:     ${role}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n⚠️  Please save these credentials securely!');
    console.log('You can now login at /admin/login');
    console.log('\nNote: This admin is shared with geneveda-biosciences project.');

    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to create admin user:', error.message);
    if (error.message.includes('admins_role')) {
      console.error('\nNote: Make sure the database has the admins_role enum type.');
      console.error('If this is a fresh database, you may need to run geneveda-biosciences migrations first.');
    }
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
