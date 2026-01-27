const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const posts = await prisma.post.findMany({
        take: 10,
        select: { title: true, slug: true }
    });
    console.log(JSON.stringify(posts, null, 2));
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
