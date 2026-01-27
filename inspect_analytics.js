const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const analytics = await prisma.analytics.findMany({
        take: 20,
        orderBy: { createdAt: 'desc' },
        where: { event: 'page_view' }
    });
    console.log(JSON.stringify(analytics, null, 2));
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
