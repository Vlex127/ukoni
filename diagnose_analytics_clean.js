const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const topPosts = await prisma.post.findMany({
        orderBy: { viewCount: 'desc' },
        take: 5,
        select: { title: true, viewCount: true, slug: true }
    });
    console.log('TOP_POSTS_START');
    console.log(JSON.stringify(topPosts, null, 2));
    console.log('TOP_POSTS_END');

    const now = new Date();
    const startOfYesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);

    const recentViews = await prisma.analytics.findMany({
        where: {
            event: 'page_view',
            createdAt: { gte: startOfYesterday }
        },
        select: { metadata: true }
    });

    console.log(`Recent views count: ${recentViews.length}`);
    const paths = recentViews.map(v => v.metadata?.path).filter(Boolean);
    const pathCounts = {};
    paths.forEach(p => pathCounts[p] = (pathCounts[p] || 0) + 1);
    console.log('Value counts for paths:');
    console.log(JSON.stringify(pathCounts, null, 2));
}

main()
    .catch(e => { console.error(e); })
    .finally(async () => { await prisma.$disconnect(); });
