import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params

        // Increment view count
        const post = await prisma.post.update({
            where: { slug },
            data: {
                viewCount: {
                    increment: 1
                }
            },
            select: {
                id: true,
                viewCount: true
            }
        })

        return NextResponse.json({
            success: true,
            viewCount: post.viewCount
        })
    } catch (error) {
        console.error('View count increment error:', error)
        // Don't fail the request if view count fails
        return NextResponse.json({
            success: false
        }, { status: 200 })
    }
}
