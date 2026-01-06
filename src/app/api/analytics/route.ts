import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const analyticsSchema = z.object({
  event: z.string(),
  postId: z.string().optional(),
  metadata: z.record(z.string(), z.any()).optional(),
})

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const eventType = searchParams.get('event')
    const postId = searchParams.get('postId')

    const where: any = {}
    
    if (eventType) where.event = eventType
    if (postId) where.postId = postId

    const analytics = await prisma.analytics.findMany({
      where,
      orderBy: {
        createdAt: 'desc'
      },
      take: 100
    })

    // Return mock data for visitor stats
    const mockData = {
      current_period: {
        total_visitors: analytics.length || 45,
        page_visitors: analytics.filter((a: any) => a.event === 'page_view').length || 32,
        comment_visitors: analytics.filter((a: any) => a.event === 'comment').length || 13
      },
      previous_period: {
        total_visitors: 38,
        page_visitors: 28,
        comment_visitors: 10
      }
    }

    return NextResponse.json(mockData)
  } catch (error) {
    console.error('Analytics GET error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
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
    const validatedData = analyticsSchema.parse(body)

    const analytics = await prisma.analytics.create({
      data: {
        ...validatedData,
        ipAddress: request.headers.get('x-forwarded-for') || 
                   request.headers.get('x-real-ip') || 
                   '127.0.0.1',
        userAgent: request.headers.get('user-agent') || '',
        metadata: validatedData.metadata || {},
      }
    })

    return NextResponse.json(analytics, { status: 201 })
  } catch (error) {
    console.error('Analytics POST error:', error)
    return NextResponse.json(
      { error: 'Failed to create analytics event' },
      { status: 500 }
    )
  }
}
