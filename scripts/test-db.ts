import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL
        }
    }
})

async function main() {
    try {
        console.log('Testing connection...')
        const userCount = await prisma.user.count()
        console.log('Connection successful! User count:', userCount)

        console.log('Fetching first post...')
        const post = await prisma.post.findFirst()
        console.log('Post fetch result:', post ? 'Found' : 'None')
    } catch (error) {
        console.error('Connection failed!')
        console.error(error)
        process.exit(1)
    } finally {
        await prisma.$disconnect()
    }
}

main()
