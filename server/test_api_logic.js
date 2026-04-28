async function testFetch() {
    try {
        const { PrismaClient } = require('@prisma/client');
        const prisma = new PrismaClient();
        
        const questions = await prisma.question.findMany();
        const mapped = questions.map(q => {
            let options;
            try { 
                options = JSON.parse(q.options); 
            } catch (err) { 
                console.log(`Failed to parse options for question ${q.id}: ${q.options}`);
                options = []; 
            }
            return { ...q, options };
        });
        
        console.log(`Successfully mapped ${mapped.length} questions.`);
        if (mapped.length > 0) {
            console.log('Sample mapped question:', mapped[0]);
        }
        
        // Let's check if there are any that would be filtered out by common logic
        const pyqs = mapped.filter(q => q.isPYQ);
        const nonPyqs = mapped.filter(q => !q.isPYQ);
        console.log(`PYQs: ${pyqs.length}, Non-PYQs: ${nonPyqs.length}`);
        
    } catch (error) {
        console.error('Test failed:', error);
    }
}

testFetch();
