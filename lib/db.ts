import { MongoClient, Db, Collection, Document } from 'mongodb';
import './suppress-warnings';

let client: MongoClient | null = null;
let db: Db | null = null;

// MongoDB connection with retry logic
async function connectToDatabase(): Promise<Db> {
  if (db) {
    return db;
  }

  const connectionString = process.env.DATABASE_URL;
  
  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not set');
  }

  // Replace <db_password> placeholder if present
  const finalConnectionString = connectionString.replace('<db_password>', process.env.DB_PASSWORD || '');

  try {
    client = new MongoClient(finalConnectionString, {
      serverSelectionTimeoutMS: process.env.NODE_ENV === 'production' ? 12000 : 30000,
      connectTimeoutMS: process.env.NODE_ENV === 'production' ? 15000 : 10000,
      maxPoolSize: process.env.NODE_ENV === 'production' ? 5 : 10,
      minPoolSize: 1,
    });

    await client.connect();
    db = client.db(); // Use default database from connection string
    
    if (process.env.NODE_ENV === 'development') {
      console.log('Connected to MongoDB');
    }
    
    return db;
  } catch (error: any) {
    console.error('Failed to connect to MongoDB:', error.message);
    throw error;
  }
}

// Helper to get database instance
export async function getDatabase(): Promise<Db> {
  return await connectToDatabase();
}

// Helper to get a collection
export async function getCollection<T extends Document = Document>(collectionName: string): Promise<Collection<T>> {
  const database = await getDatabase();
  return database.collection<T>(collectionName);
}

// Helper function for MongoDB queries with timeout and retry logic
export async function query<T extends Document = Document>(
  collectionName: string,
  operation: (collection: Collection<T>) => Promise<any>,
  timeoutMs: number = process.env.NODE_ENV === 'production' ? 12000 : 30000,
  retries: number = 1
): Promise<any> {
  const start = Date.now();
  let lastError: any;
  
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const collection = await getCollection<T>(collectionName);
      
      // Use Promise.race to add a timeout wrapper
      const operationPromise = operation(collection);
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Query timeout')), timeoutMs);
      });
      
      const res = await Promise.race([operationPromise, timeoutPromise]);
      const duration = Date.now() - start;
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`Executed MongoDB operation on ${collectionName}`, { duration });
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
        error.name === 'MongoServerSelectionError' ||
        error.name === 'MongoNetworkError';
      
      // Retry connection errors (except on last attempt)
      if (isConnectionError && attempt < retries) {
        // Reset connection on error
        if (client) {
          try {
            await client.close();
          } catch (e) {
            // Ignore close errors
          }
        }
        client = null;
        db = null;
        
        const delay = Math.min(500 * (attempt + 1), 1000); // Short backoff: 500ms, max 1s
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      
      // Don't log timeout errors during build to reduce noise
      if (error.code !== 'ETIMEDOUT' && !error.message.includes('timeout')) {
        console.error('MongoDB query error:', error);
      }
      throw error;
    }
  }
  
  // If we exhausted all retries, throw the last error
  throw lastError;
}

// Close connection (useful for cleanup)
export async function closeConnection(): Promise<void> {
  if (client) {
    await client.close();
    client = null;
    db = null;
  }
}
