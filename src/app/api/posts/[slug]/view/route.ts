import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params
        console.log(`View increment: API hit for slug [${slug}]`)

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
                viewCount: true,
                title: true
            }
        })

        console.log(`View increment: Success for [${post.title}]. New count: ${post.viewCount}`)

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
