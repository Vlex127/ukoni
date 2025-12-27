import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db, users } from '@/lib/db';
import { eq } from 'drizzle-orm';

// Simple in-memory cache with timestamp to avoid stale data
const userCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5000; // 5 seconds cache

async function getUserById(userId: string) {
  const now = Date.now();
  const cached = userCache.get(userId);
  
  // Return cached data if it's fresh
  if (cached && (now - cached.timestamp) < CACHE_DURATION) {
    return cached.data;
  }
  
  // Fetch fresh data from database
  const userProfile = await db
    .select({
      id: users.id,
      email: users.email,
      name: users.name,
      picture: users.picture,
      emailVerified: users.emailVerified,
      admin: users.admin,
      about: users.about,
      phone: users.phone,
      location: users.location,
      website: users.website,
      twitter: users.twitter,
      linkedin: users.linkedin,
      facebook: users.facebook,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);
  
  // Cache the result
  userCache.set(userId, { data: userProfile, timestamp: now });
  
  return userProfile;
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const userProfile = await getUserById(session.user.id);

    if (userProfile.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user: userProfile[0] });
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}