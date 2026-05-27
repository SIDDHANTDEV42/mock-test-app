const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function main() {
    try {
        const tests = await p.test.findMany({ take: 1 });
        if (tests.length === 0) {
            console.log('No tests to delete.');
            return;
        }
        const id = tests[0].id;
        console.log(`Attempting to delete test: ${id}`);
        
        await p.result.deleteMany({ where: { testId: id } });
        await p.review.deleteMany({ where: { testId: id } });
        await p.test.delete({ where: { id } });
        
        console.log('Success!');
    } catch (e) {
        console.error('FAILED WITH ERROR:', e);
    } finally {
        await p.$disconnect();
    }
}

main();
