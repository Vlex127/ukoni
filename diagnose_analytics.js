const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const total = await prisma.analytics.count();
    console.log(`Total analytics records: ${total}`);

    const pageViews = await prisma.analytics.findMany({
        where: { event: 'page_view' },
        orderBy: { createdAt: 'desc' },
        take: 5
    });

    console.log('Recent page_view events:');
    pageViews.forEach(log => {
        console.log(`- ID: ${log.id}, CreatedAt: ${log.createdAt}`);
        console.log(`  Metadata: ${JSON.stringify(log.metadata)}`);
        const hasPath = log.metadata && typeof log.metadata === 'object' && 'path' in log.metadata;
        console.log(`  Has path: ${hasPath}`);
        if (hasPath) console.log(`  Path value: ${log.metadata.path}`);
    });

    const topPosts = await prisma.post.findMany({
        orderBy: { viewCount: 'desc' },
        take: 3,
        select: { title: true, viewCount: true, slug: true }
    });
    console.log('\nTop posts by viewCount (from Post table):');
    console.log(JSON.stringify(topPosts, null, 2));
}

main()
    .catch(e => { console.error(e); process.exit(1); })
    .finally(async () => { await prisma.$disconnect(); });
