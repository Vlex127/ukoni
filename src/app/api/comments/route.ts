import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const commentSchema = z.object({
  postId: z.string(),
  authorName: z.string().min(1),
  authorEmail: z.string().email(),
  content: z.string().min(1),
  parentId: z.string().nullable().optional(),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const postId = searchParams.get('postId')

    const where: any = {}
    
    if (status) where.status = status
    if (postId) where.postId = postId

    const comments = await prisma.comment.findMany({
      where,
      include: {
        post: {
          select: {
            id: true,
            title: true,
            slug: true,
          }
        },
        parent: {
          select: {
            id: true,
            authorName: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(comments)
  } catch (error) {
    console.error('Comments GET error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('Received comment data:', body)
    
    const validatedData = commentSchema.parse(body)
    console.log('Validated comment data:', validatedData)

    const comment = await prisma.comment.create({
      data: {
        ...validatedData,
        ipAddress: request.headers.get('x-forwarded-for') || 
                   request.headers.get('x-real-ip') || 
                   '127.0.0.1',
        userAgent: request.headers.get('user-agent') || '',
      },
      include: {
        post: {
          select: {
            id: true,
            title: true,
            slug: true,
          }
        }
      }
    })

    return NextResponse.json(comment, { status: 201 })
  } catch (error) {
    console.error('Comments POST error:', error)
    if (error instanceof z.ZodError) {
      console.error('Validation errors:', error.issues)
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      )
    }
    console.error('Database error details:', error)
    return NextResponse.json(
      { error: 'Failed to create comment', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
