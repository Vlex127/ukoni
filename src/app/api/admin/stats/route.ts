import { NextResponse } from 'next/server';
import { db, posts, comments } from '@/lib/db';
import { eq, sql, count } from 'drizzle-orm';

export async function GET() {
  try {
    // Get total posts count
    const postsResult = await db
      .select({ count: count() })
      .from(posts)
      .where(eq(posts.postType, 'post'));

    // Get total pages count  
    const pagesResult = await db
      .select({ count: count() })
      .from(posts)
      .where(eq(posts.postType, 'page'));

    // Get total comments count
    const commentsResult = await db
      .select({ count: count() })
      .from(comments)
      .where(eq(comments.status, 'approved'));

    // Get total views
    const viewsResult = await db
      .select({ total: sql<number>`sum(${posts.viewsCount})`.mapWith(Number) })
      .from(posts);

    // Get total likes
    const likesResult = await db
      .select({ total: sql<number>`sum(${posts.likesCount})`.mapWith(Number) })
      .from(posts);

    return NextResponse.json({
      totalPosts: postsResult[0]?.count || 0,
      totalPages: pagesResult[0]?.count || 0,
      totalComments: commentsResult[0]?.count || 0,
      totalViews: viewsResult[0]?.total || 0,
      totalLikes: likesResult[0]?.total || 0,
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
