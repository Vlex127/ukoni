import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { emailService } from '@/lib/email'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    // Atomic update: Increment viewCount AND fetch the post in one operation
    // This is the "New Format" for tracking views more reliably
    const post = await prisma.post.update({
      where: { slug },
      data: {
        viewCount: {
          increment: 1
        }
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            fullName: true,
          }
        },
        _count: {
          select: {
            comments: true
          }
        }
      }
    })

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(post)
  } catch (error) {
    console.error('Post GET/View error:', error)

    // Fallback: If update fails (e.g. record not found in a race condition), try finding without update
    try {
      const { slug } = await params
      const post = await prisma.post.findUnique({
        where: { slug },
        include: {
          author: {
            select: { id: true, username: true, fullName: true }
          },
          _count: {
            select: { comments: true }
          }
        }
      })
      if (post) return NextResponse.json(post)
    } catch (fallbackError) {
      console.error('Post fallback GET error:', fallbackError)
    }

    return NextResponse.json(
      { error: 'Failed to fetch post' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { slug } = await params
    const body = await request.json()

    const post = await prisma.post.update({
      where: { slug },
      data: {
        ...body,
        publishedAt: body.status === 'published' && !body.publishedAt ? new Date() : body.publishedAt,
        updatedAt: new Date(),
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            fullName: true,
          }
        }
      }
    })

    // Trigger email notification if post is newly featured and published
    if (post.isFeatured && post.status === 'published' && !(post as any).notificationSent) {
      try {
        const subscribers = await prisma.subscriber.findMany({
          where: { isActive: true },
          select: { email: true }
        });
        const emails = subscribers.map(s => s.email);

        emailService.sendFeaturedPostNotification(emails, {
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt
        }).then(async () => {
          await (prisma.post as any).update({
            where: { id: post.id },
            data: { notificationSent: true }
          });
        }).catch(err => console.error('Notification error:', err));
      } catch (err) {
        console.error('Failed to notify subscribers:', err);
      }
    }

    return NextResponse.json(post)
  } catch (error) {
    console.error('Post PUT error:', error)
    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { slug } = await params

    const postToDelete = await prisma.post.findFirst({
      where: {
        OR: [
          { id: slug },
          { slug: slug }
        ]
      }
    })

    if (!postToDelete) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    await prisma.post.delete({
      where: { id: postToDelete.id }
    })

    return NextResponse.json({ message: 'Post deleted successfully' })
  } catch (error) {
    console.error('Post DELETE error:', error)
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    )
  }
}
