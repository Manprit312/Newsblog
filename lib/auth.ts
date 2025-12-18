import { prisma } from './db';
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
      // Verify user still exists - using geneveda's Admin model (admins table)
      const userId = parseInt(payload.id, 10);
      if (isNaN(userId)) {
        return null;
      }

      const admin = await prisma.$queryRaw`
        SELECT id, email, name, role, active
        FROM admins
        WHERE id = ${userId} AND active = true
      ` as Array<{
        id: number;
        email: string;
        name: string;
        role: string;
        active: boolean;
      }>;
      
      if (!admin || admin.length === 0) {
        return null;
      }

      const user = admin[0];

      return {
        id: user.id.toString(),
        email: user.email,
        name: user.name || undefined,
        role: user.role,
      };
    } catch (error: any) {
      console.error('Failed to load current user from database.', error);
      // If the database is unavailable, treat as unauthenticated
      return null;
    }
  } catch {
    return null;
  }
}

export async function loginUser(email: string, password: string) {
  try {
    // Query geneveda's Admin model (admins table)
    const admin = await prisma.$queryRaw`
      SELECT id, email, password_hash, name, role, active
      FROM admins
      WHERE email = ${email} AND active = true
    ` as Array<{
      id: number;
      email: string;
      password_hash: string;
      name: string;
      role: string;
      active: boolean;
    }>;
    
    if (!admin || admin.length === 0) {
      return { error: 'Invalid email or password' };
    }

    const user = admin[0];

    const isValid = await verifyPassword(password, user.password_hash);
    if (!isValid) {
      return { error: 'Invalid email or password' };
    }

    const payload: UserPayload = {
      id: user.id.toString(),
      email: user.email,
      name: user.name || undefined,
      role: user.role,
    };

    const token = generateToken(payload);

    // Update last login
    await prisma.$executeRaw`
      UPDATE admins
      SET last_login = NOW()
      WHERE id = ${user.id}
    `;

    return { token, user: payload };
  } catch (error: any) {
    console.error('Failed to login user due to database error.', error);
    return { error: 'Authentication is temporarily unavailable. Please try again later.' };
  }
}
