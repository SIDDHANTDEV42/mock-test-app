const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

p.question.count().then(count => {
    console.log(`Total questions in DB: ${count}`);
    return p.question.findMany({ take: 2 });
}).then(q => {
    console.log('Sample questions:', q.map(x => ({ id: x.id, text: x.text, options: x.options })));
}).finally(() => p.$disconnect());
