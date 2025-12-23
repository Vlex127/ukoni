import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { eq } from 'drizzle-orm';
import { db, users, sessions } from './db';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

// Custom authentication functions using Neon
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// Helper function to get Gmail profile picture
export function getGmailProfilePicture(email: string): string {
  // Convert email to lowercase and remove spaces
  const cleanEmail = email.toLowerCase().trim();
  // Use Google's profile picture API
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(cleanEmail)}&background=random&size=128`;
}

export async function createUser(email: string, password: string, name?: string) {
  const hashedPassword = await hashPassword(password);
  const profilePicture = getGmailProfilePicture(email);
  
  const newUser = await db.insert(users).values({
    email,
    password: hashedPassword,
    name,
    picture: profilePicture,
    emailVerified: false
  }).returning();
  
  return newUser[0];
}

export async function getUserByEmail(email: string) {
  const user = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return user[0] || null;
}

export async function createSession(userId: string) {
  const token = uuidv4();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7 days
  
  const newSession = await db.insert(sessions).values({
    userId,
    token,
    expiresAt
  }).returning();
  
  return newSession[0];
}

export async function validateSession(token: string) {
  const session = await db
    .select({
      session: sessions,
      user: users
    })
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .where(eq(sessions.token, token))
    .limit(1);
    
  if (!session[0] || new Date(session[0].session.expiresAt) < new Date()) {
    return null;
  }
  
  return session[0];
}

export async function signUpUser(email: string, password: string, name?: string) {
  try {
    // Check if user already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      throw new Error('User already exists');
    }
    
    // Create new user
    const user = await createUser(email, password, name);
    
    // Create session
    const session = await createSession(user.id);
    
    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        emailVerified: user.emailVerified
      },
      session: {
        token: session.token,
        expiresAt: session.expiresAt
      }
    };
  } catch (error) {
    console.error('Signup error:', error);
    throw error;
  }
}