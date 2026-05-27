const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function deleteTrail() {
    try {
        const test = await p.test.findFirst({ where: { title: 'TRAIL1' } });
        if (!test) {
            console.log('TRAIL1 not found. It might have already been deleted.');
            return;
        }
        console.log(`Deleting TRAIL1 (${test.id})`);
        
        await p.$transaction(async (tx) => {
            await tx.result.deleteMany({ where: { testId: test.id } });
            await tx.review.deleteMany({ where: { testId: test.id } });
            await tx.test.update({ where: { id: test.id }, data: { questions: { set: [] } } });
            await tx.test.delete({ where: { id: test.id } });
        });
        console.log('TRAIL1 successfully deleted via the new logic.');
    } catch (e) {
        console.error('FAILED:', e.message);
    } finally {
        await p.$disconnect();
    }
}

deleteTrail();
