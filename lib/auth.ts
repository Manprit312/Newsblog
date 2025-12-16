import { query } from './db';
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
      const result = await query('SELECT id, email, name, role FROM "User" WHERE id = $1', [payload.id], 20000, 2);
      
      if (result.rows.length === 0) {
        return null;
      }

      const user = result.rows[0];

      return {
        id: user.id,
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
    const result = await query('SELECT * FROM "User" WHERE email = $1', [email], 20000, 2);
    
    if (result.rows.length === 0) {
      return { error: 'Invalid email or password' };
    }

    const user = result.rows[0];

    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      return { error: 'Invalid email or password' };
    }

    const payload: UserPayload = {
      id: user.id,
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
