// Try to load .env files from multiple locations
require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

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
    console.log('SSL configured for remote database connection');
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

async function setupDatabase() {
  try {
    console.log('Setting up database tables...');
    
    // Read the SQL migration file
    const sqlPath = path.join(process.cwd(), 'migrations', '001_create_tables.sql');
    let sql = fs.readFileSync(sqlPath, 'utf-8');
    
    // Remove single-line comments
    sql = sql.replace(/--.*$/gm, '');
    
    // Split by semicolons, but handle dollar-quoted strings
    const statements = [];
    let currentStatement = '';
    let inDollarQuote = false;
    let dollarTag = '';
    
    for (let i = 0; i < sql.length; i++) {
      const char = sql[i];
      const nextChar = sql[i + 1];
      
      // Check for dollar-quoted strings
      if (char === '$' && !inDollarQuote) {
        // Find the closing $
        let j = i + 1;
        while (j < sql.length && sql[j] !== '$') j++;
        if (j < sql.length) {
          dollarTag = sql.substring(i, j + 1);
          inDollarQuote = true;
          currentStatement += dollarTag;
          i = j;
          continue;
        }
      } else if (inDollarQuote && sql.substring(i, i + dollarTag.length) === dollarTag) {
        currentStatement += dollarTag;
        i += dollarTag.length - 1;
        inDollarQuote = false;
        dollarTag = '';
        continue;
      }
      
      currentStatement += char;
      
      // If we hit a semicolon and we're not in a dollar quote, end the statement
      if (char === ';' && !inDollarQuote) {
        const trimmed = currentStatement.trim();
        if (trimmed.length > 0) {
          statements.push(trimmed);
        }
        currentStatement = '';
      }
    }
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        try {
          await query(statement);
          console.log(`✓ Executed statement ${i + 1}/${statements.length}`);
        } catch (error) {
          // Ignore "already exists" errors
          if (error.code === '42P07' || error.code === '42710' || error.code === '42723' || error.code === '42704') {
            console.log(`⚠ Statement ${i + 1} already exists, skipping...`);
          } else {
            console.error(`Error executing statement ${i + 1}:`, error.message);
            throw error;
          }
        }
      }
    }
    
    console.log('✅ Database setup completed successfully!');
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    await pool.end();
    process.exit(1);
  }
}

setupDatabase();
