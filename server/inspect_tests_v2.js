const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function debugTests() {
    const tests = await prisma.test.findMany({
        select: { id: true, title: true, isCustom: true, userId: true }
    });
    console.log(JSON.stringify(tests, null, 2));
    
    const countFalse = await prisma.test.count({ where: { isCustom: false } });
    const countTrue = await prisma.test.count({ where: { isCustom: true } });
    console.log(`Count (isCustom: false): ${countFalse}`);
    console.log(`Count (isCustom: true): ${countTrue}`);
    
    process.exit(0);
}

debugTests().catch(e => { console.error(e); process.exit(1); });
