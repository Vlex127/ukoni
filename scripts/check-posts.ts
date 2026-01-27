import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    try {
        const posts = await prisma.post.findMany({
            select: {
                id: true,
                title: true,
                slug: true,
                viewCount: true
            }
        })
        console.log('Posts in database:', JSON.stringify(posts, null, 2))
    } catch (error) {
        console.error('Error fetching posts:', error)
    } finally {
        await prisma.$disconnect()
    }
}

main()
