import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { emailService } from '@/lib/email'

const postSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().optional(),
  content: z.string().min(1, "Content is required"),
  excerpt: z.string().optional(),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  category: z.string().optional(),
  featuredImage: z.string().optional(),
  featuredImageUrl: z.string().optional(),
  featuredImagePublicId: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  isFeatured: z.boolean().default(false),
})

function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')     // Replace spaces with -
    .replace(/[^\w-]+/g, '')     // Remove all non-word chars
    .replace(/--+/g, '-')       // Replace multiple - with single -
    .replace(/^-+/, '')         // Trim - from start of text
    .replace(/-+$/, '')         // Trim - from end of text
    + '-' + Math.random().toString(36).substring(2, 7) // Add random string for uniqueness
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    const where: any = {}

    if (status) where.status = status
    if (category) where.category = category
    if (featured === 'true') where.isFeatured = true

    const posts = await prisma.post.findMany({
      where,
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
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip,
      take: limit,
    })

    const total = await prisma.post.count({ where })

    return NextResponse.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Posts GET error:', error)
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined,
    })
    return NextResponse.json(
      {
        error: 'Failed to fetch posts',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    console.log('Received post data:', body)

    let validatedData
    try {
      validatedData = postSchema.parse(body)
    } catch (validationError) {
      console.error('Validation error:', validationError)
      if (validationError instanceof z.ZodError) {
        return NextResponse.json(
          { error: 'Validation failed', details: validationError.issues },
          { status: 400 }
        )
      }
      return NextResponse.json(
        { error: 'Validation failed' },
        { status: 400 }
      )
    }

    console.log('Validated data:', validatedData)

    // Generate slug if not provided
    const slug = validatedData.slug || slugify(validatedData.title)

    const post = await prisma.post.create({
      data: {
        ...validatedData,
        slug,
        authorId: session.user.id,
        publishedAt: validatedData.status === 'published' ? new Date() : null,
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

    console.log('Created post:', post)

    // Trigger email notification if post is featured and published
    if ((post as any).isFeatured && (post as any).status === 'published') {
      try {
        const subscribers = await prisma.subscriber.findMany({
          where: { isActive: true },
          select: { email: true }
        });
        const emails = subscribers.map(s => s.email);

        // Don't await this to avoid delaying the response
        emailService.sendFeaturedPostNotification(emails, {
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt
        }).then(async () => {
          // Mark as sent in DB
          await (prisma.post as any).update({
            where: { id: post.id },
            data: { notificationSent: true }
          });
        }).catch(err => console.error('Notification error:', err));
      } catch (err) {
        console.error('Failed to fetch subscribers for notification:', err);
      }
    }

    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    console.error('Posts POST error:', error)
    return NextResponse.json(
      { error: 'Failed to create post', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
