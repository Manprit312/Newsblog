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
  // We'll use the ssl config object instead
  connectionString = connectionString.replace(/[?&]sslmode=[^&]*/g, '');

  const config: PoolConfig = {
    connectionString,
    // Connection timeout settings
    connectionTimeoutMillis: 10000, // 10 seconds to establish connection
    // Pool settings
    max: 20, // Maximum number of clients in the pool
    idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
    // Keep connections alive
    keepAlive: true,
    keepAliveInitialDelayMillis: 10000,
  };

  // For remote connections, configure SSL to accept self-signed certificates
  // The database requires SSL encryption, so we must enable it
  if (!isLocalhost) {
    // Force SSL configuration - require SSL but accept self-signed certificates
    // Setting ssl to an object enables SSL and accepts self-signed certs
    config.ssl = {
      rejectUnauthorized: false
    };
    // Only log in development to reduce build output noise
    if (process.env.NODE_ENV === 'development') {
      console.log('SSL configured for remote database connection (required, self-signed certs allowed)');
    }
  } else {
    // Explicitly disable SSL for localhost
    config.ssl = false;
    if (process.env.NODE_ENV === 'development') {
      console.log('SSL disabled for localhost connection');
    }
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

// Helper function to execute queries with timeout
export async function query(text: string, params?: any[], timeoutMs: number = 30000) {
  const start = Date.now();
  try {
    // Use Promise.race to add a timeout wrapper
    const queryPromise = pool.query(text, params);
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Query timeout')), timeoutMs);
    });
    
    const res = await Promise.race([queryPromise, timeoutPromise]) as any;
    const duration = Date.now() - start;
    if (process.env.NODE_ENV === 'development') {
      console.log('Executed query', { text, duration, rows: res.rowCount });
    }
    return res;
  } catch (error: any) {
    // Don't log timeout errors during build to reduce noise
    if (error.code !== 'ETIMEDOUT' && !error.message.includes('timeout')) {
      console.error('Database query error:', error);
    }
    throw error;
  }
}

// Helper to get a client from the pool
export async function getClient() {
  const client = await pool.connect();
  return client;
}

