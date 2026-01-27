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
        const users = await prisma.user.findMany({
            select: {
                email: true,
                username: true,
                fullName: true,
                isActive: true
            }
        })
        console.log('Users in database:', JSON.stringify(users, null, 2))
    } catch (error) {
        console.error('Error fetching users:', error)
    } finally {
        await prisma.$disconnect()
    }
}

main()
