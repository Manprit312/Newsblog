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
    // Connection timeout settings - increased for production
    connectionTimeoutMillis: process.env.NODE_ENV === 'production' ? 30000 : 10000, // 30s in prod, 10s in dev
    // Pool settings - optimized for serverless/production
    max: process.env.NODE_ENV === 'production' ? 10 : 20, // Lower max connections in prod for serverless
    idleTimeoutMillis: process.env.NODE_ENV === 'production' ? 10000 : 30000, // Shorter idle timeout in prod
    // Keep connections alive
    keepAlive: true,
    keepAliveInitialDelayMillis: 10000,
    // Allow pool to wait for connections
    allowExitOnIdle: false,
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
  // Don't exit process in production - let the pool handle reconnection
  // In serverless environments, exiting the process is not appropriate
  if (process.env.NODE_ENV === 'development') {
    // Only exit in development for easier debugging
    // process.exit(-1);
  }
});

export { pool };

// Helper function to execute queries with timeout and retry logic
export async function query(
  text: string, 
  params?: any[], 
  timeoutMs: number = process.env.NODE_ENV === 'production' ? 20000 : 30000,
  retries: number = 2
): Promise<any> {
  const start = Date.now();
  let lastError: any;
  
  for (let attempt = 0; attempt <= retries; attempt++) {
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
      lastError = error;
      
      // Check if it's a connection error that might benefit from retry
      const isConnectionError = 
        error.code === 'ETIMEDOUT' || 
        error.message?.includes('timeout') ||
        error.message?.includes('Connection terminated') ||
        error.cause?.message?.includes('Connection terminated') ||
        error.code === 'ECONNREFUSED' ||
        error.code === 'ENOTFOUND' ||
        error.code === '57P01'; // Admin shutdown
      
      // Retry connection errors (except on last attempt)
      if (isConnectionError && attempt < retries) {
        const delay = Math.min(1000 * Math.pow(2, attempt), 5000); // Exponential backoff, max 5s
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      
      // Don't log timeout errors during build to reduce noise
      if (error.code !== 'ETIMEDOUT' && !error.message.includes('timeout')) {
        console.error('Database query error:', error);
      }
      throw error;
    }
  }
  
  // If we exhausted all retries, throw the last error
  throw lastError;
}

// Helper to get a client from the pool
export async function getClient() {
  const client = await pool.connect();
  return client;
}

