import { Pool, PoolConfig } from 'pg';

// Parse connection string and configure SSL
const getPoolConfig = (): PoolConfig => {
  let connectionString = process.env.DATABASE_URL;
  
  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not set');
  }

  // Check if it's a localhost connection
  const isLocalhost = connectionString.includes('localhost') || 
                      connectionString.includes('127.0.0.1') ||
                      connectionString.includes('::1');

  // Remove any existing sslmode parameters from connection string to avoid conflicts
  connectionString = connectionString.replace(/[?&]sslmode=[^&]*/g, '');

  const config: PoolConfig = {
    connectionString,
  };

  // For remote connections, configure SSL to accept self-signed certificates
  // This must be set explicitly to handle self-signed certs
  if (!isLocalhost) {
    // Force SSL configuration to accept self-signed certificates
    config.ssl = {
      rejectUnauthorized: false
    };
    console.log('SSL configured for remote database connection (self-signed certs allowed)');
  } else {
    // Explicitly disable SSL for localhost
    config.ssl = false;
    console.log('SSL disabled for localhost connection');
  }

  return config;
};

// Create a connection pool with explicit SSL configuration
const poolConfig = getPoolConfig();
const pool = new Pool(poolConfig);

// Test the connection
pool.on('connect', () => {
  console.log('Database connected');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

export { pool };

// Helper function to execute queries
export async function query(text: string, params?: any[]) {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    if (process.env.NODE_ENV === 'development') {
      console.log('Executed query', { text, duration, rows: res.rowCount });
    }
    return res;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

// Helper to get a client from the pool
export async function getClient() {
  const client = await pool.connect();
  return client;
}

