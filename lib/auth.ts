import { query } from './db';
import { ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export interface UserPayload {
  id: string;
  email: string;
  name?: string;
  role: string;
}

type UserDocument = {
  _id?: ObjectId;
  email: string;
  password: string;
  name?: string;
  role: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export function generateToken(payload: UserPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): UserPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as UserPayload;
  } catch {
    return null;
  }
}

export async function getCurrentUser(): Promise<UserPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;
    
    if (!token) {
      return null;
    }

    const payload = verifyToken(token);
    if (!payload) {
      return null;
    }

    try {
      // Verify user still exists with retry logic
      const result = await query<UserDocument>(
        'users',
        async (collection) => {
          if (ObjectId.isValid(payload.id)) {
            return await collection.findOne(
              { _id: new ObjectId(payload.id) },
              { projection: { _id: 1, email: 1, name: 1, role: 1 } }
            );
          }
          // Try as string if ObjectId is not valid
          return await collection.findOne(
            { _id: payload.id as any },
            { projection: { _id: 1, email: 1, name: 1, role: 1 } }
          );
        },
        12000,
        1
      );
      
      if (!result) {
        return null;
      }

      const user = result as UserDocument;

      return {
        id: user._id?.toString() || payload.id,
        email: user.email,
        name: user.name || undefined,
        role: user.role,
      };
    } catch (error: any) {
      // Don't log connection errors for getCurrentUser as it's called frequently
      const isConnectionError = 
        error.code === 'ETIMEDOUT' || 
        error.message?.includes('timeout') ||
        error.message?.includes('Connection terminated') ||
        error.cause?.message?.includes('Connection terminated');
      
      if (!isConnectionError) {
        console.error('Failed to load current user from database.', error);
      }
      // If the database is unavailable, treat as unauthenticated
      return null;
    }
  } catch {
    return null;
  }
}

export async function loginUser(email: string, password: string) {
  try {
    const result = await query<UserDocument>(
      'users',
      async (collection) => {
        return await collection.findOne({ email });
      },
      12000,
      1
    );
    
    if (!result) {
      return { error: 'Invalid email or password' };
    }

    const user = result as UserDocument;

    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      return { error: 'Invalid email or password' };
    }

    const payload: UserPayload = {
      id: user._id?.toString() || '',
      email: user.email,
      name: user.name || undefined,
      role: user.role,
    };

    const token = generateToken(payload);

    return { token, user: payload };
  } catch (error: any) {
    // Check if it's a connection error
    const isConnectionError = 
      error.code === 'ETIMEDOUT' || 
      error.message?.includes('timeout') ||
      error.message?.includes('Connection terminated') ||
      error.cause?.message?.includes('Connection terminated') ||
      error.code === 'ECONNREFUSED' ||
      error.code === 'ENOTFOUND';
    
    if (isConnectionError) {
      console.error('Database connection error during login:', error.message || error.code);
    } else {
      console.error('Failed to login user due to database error.', error);
    }
    return { error: 'Authentication is temporarily unavailable. Please try again later.' };
  }
}
