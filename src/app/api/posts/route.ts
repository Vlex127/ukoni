import { NextResponse } from 'next/server';
import { db, posts, users } from '@/lib/db';
import { eq, sql, desc } from 'drizzle-orm';

export async function GET() {
  try {
    // Fetch published posts with author info
    const postsData = await db
      .select({
        id: posts.id,
        title: posts.title,
        slug: posts.slug,
        excerpt: posts.excerpt,
        content: posts.content,
        thumbnailUrl: posts.thumbnailUrl,
        postType: posts.postType,
        status: posts.status,
        viewsCount: posts.viewsCount,
        likesCount: posts.likesCount,
        publishedAt: posts.publishedAt,
        createdAt: posts.createdAt,
        updatedAt: posts.updatedAt,
        author: {
          name: users.name,
          email: users.email,
        }
      })
      .from(posts)
      .leftJoin(users, eq(posts.userId, users.id))
      .where(
        sql`${posts.postType} = 'post' AND ${posts.status} = 'published'`
      )
      .orderBy(desc(posts.publishedAt));

    // Transform data to match the expected format
    const transformedPosts = postsData.map(post => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || post.content?.substring(0, 150) + '...',
      author: post.author?.name || 'Anonymous',
      date: post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      }) : new Date(post.createdAt).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      }),
      readTime: `${Math.max(1, Math.ceil((post.content?.length || 0) / 1000))} min read`,
      category: 'Design', // You can add categories to your posts table later
      color: 'bg-blue-100', // You can make this dynamic
      thumbnailUrl: post.thumbnailUrl,
    }));

    return NextResponse.json(transformedPosts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}
