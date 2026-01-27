const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const now = new Date();
    const startOfYesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);

    const recentViews = await prisma.analytics.findMany({
        where: {
            event: 'page_view',
            createdAt: { gte: startOfYesterday }
        },
        select: { metadata: true }
    });

    const pathCounts = {};
    recentViews.forEach(v => {
        const p = v.metadata?.path;
        if (p) pathCounts[p] = (pathCounts[p] || 0) + 1;
    });

    console.log('PATH_COUNTS_START');
    console.log(JSON.stringify(pathCounts, null, 2));
    console.log('PATH_COUNTS_END');
}

main()
    .catch(e => { console.error(e); })
    .finally(async () => { await prisma.$disconnect(); });
