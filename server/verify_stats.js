const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkStats() {
    const totalTests = await prisma.test.count();
    const officialTests = await prisma.test.count({ where: { isCustom: false } });
    const customTests = await prisma.test.count({ where: { isCustom: true } });
    
    console.log('Total Tests in DB:', totalTests);
    console.log('Official (Active) Tests:', officialTests);
    console.log('Custom Tests:', customTests);
    
    process.exit(0);
}

checkStats();
