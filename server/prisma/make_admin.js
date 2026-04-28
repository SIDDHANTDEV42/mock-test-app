const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const user = await prisma.user.updateMany({
        where: { name: "Siddhant" },
        data: { role: "ADMIN" }
    });
    console.log(`Updated ${user.count} users to ADMIN`);
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
