import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { id } = await params
        const body = await request.json()

        const comment = await prisma.comment.update({
            where: { id },
            data: {
                status: body.status,
                content: body.content,
            },
        })

        return NextResponse.json(comment)
    } catch (error) {
        console.error('Comment PUT error:', error)
        return NextResponse.json({ error: 'Failed to update comment' }, { status: 500 })
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { id } = await params
        const { searchParams } = new URL(request.url)
        const mode = searchParams.get('mode')

        if (mode === 'permanent') {
            await prisma.comment.delete({
                where: { id },
            })
            return NextResponse.json({ success: true, mode: 'permanent' })
        }

        // Default to "Soft delete" by updating status to 'deleted'
        const comment = await prisma.comment.update({
            where: { id },
            data: {
                status: 'deleted',
            },
        })

        return NextResponse.json({ success: true, mode: 'moderate', comment })
    } catch (error) {
        console.error('Comment DELETE error:', error)
        return NextResponse.json({ error: 'Failed to delete comment' }, { status: 500 })
    }
}
