import { NextResponse } from 'next/server';
import { db, posts, comments } from '@/lib/db';
import { eq, sql, count } from 'drizzle-orm';

export async function GET() {
  try {
    // Get total posts count
    let totalPosts = 0;
    try {
      const postsResult = await db
        .select({ count: count() })
        .from(posts)
        .where(sql`post_type = 'post'`);
      totalPosts = postsResult[0]?.count || 0;
    } catch (error) {
      console.error('Error fetching posts:', error);
    }

    // Get total pages count  
    let totalPages = 0;
    try {
      const pagesResult = await db
        .select({ count: count() })
        .from(posts)
        .where(sql`post_type = 'page'`);
      totalPages = pagesResult[0]?.count || 0;
    } catch (error) {
      console.error('Error fetching pages:', error);
    }

    // Get total comments count (handle missing comments table)
    let totalComments = 0;
    try {
      const commentsResult = await db
        .select({ count: count() })
        .from(comments)
        .where(eq(comments.commentStatus, 'approved'));
      totalComments = commentsResult[0]?.count || 0;
    } catch (error) {
      console.error('Comments table not found or error:', error);
      // Try alternative column name if the error is about missing column
      try {
        const commentsResult = await db
          .select({ count: count() })
          .from(comments);
        totalComments = commentsResult[0]?.count || 0;
      } catch (fallbackError) {
        console.error('Comments table completely unavailable:', fallbackError);
        totalComments = 0;
      }
    }

    // Get total views
    let totalViews = 0;
    try {
      const viewsResult = await db
        .select({ total: sql<number>`sum(${posts.viewsCount})`.mapWith(Number) })
        .from(posts);
      totalViews = viewsResult[0]?.total || 0;
    } catch (error) {
      console.error('Error fetching views:', error);
    }

    // Get total likes
    let totalLikes = 0;
    try {
      const likesResult = await db
        .select({ total: sql<number>`sum(${posts.likesCount})`.mapWith(Number) })
        .from(posts);
      totalLikes = likesResult[0]?.total || 0;
    } catch (error) {
      console.error('Error fetching likes:', error);
    }

    console.log('Stats response:', {
      totalPosts,
      totalPages,
      totalComments,
      totalViews,
      totalLikes
    });

    return NextResponse.json({
      totalPosts,
      totalPages,
      totalComments,
      totalViews,
      totalLikes,
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
