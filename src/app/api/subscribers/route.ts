import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { subscribers } from '@/lib/db/schema';
import { eq, sql } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    // Get total active subscribers
    const totalActive = await db
      .select({ count: sql<number>`count(*)` })
      .from(subscribers)
      .where(eq(subscribers.status, 'active'));

    // Get all subscribers count
    const totalAll = await db
      .select({ count: sql<number>`count(*)` })
      .from(subscribers);

    // Get recent subscribers (last 30 days)
    const recentSubscribers = await db
      .select()
      .from(subscribers)
      .where(eq(subscribers.status, 'active'))
      .orderBy(sql`${subscribers.subscribedAt} DESC`)
      .limit(10);

    return NextResponse.json({
      totalActive: totalActive[0]?.count || 0,
      totalAll: totalAll[0]?.count || 0,
      recentSubscribers,
    });

  } catch (error) {
    console.error('Get subscribers error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscribers' },
      { status: 500 }
    );
  }
}
