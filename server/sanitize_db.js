
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const questions = await prisma.question.findMany();
  console.log(`Total questions in DB: ${questions.length}`);
  
  let count = 0;
  for (const q of questions) {
    if (q.id === 'cm84id6160000rlyy53tznlyr' || true) { // Inspect all
      // console.log(`Question ${q.id} options: "${q.options}"`);
    }
    
    try {
      if (!q.options.startsWith('[') && !q.options.startsWith('{')) {
        throw new Error('Not JSON array/object');
      }
      JSON.parse(q.options);
    } catch (e) {
      console.log(`Fixing question ${q.id}: "${q.options}"`);
      const optionsArray = q.options.split(',').map(o => o.trim()).filter(Boolean);
      await prisma.question.update({
        where: { id: q.id },
        data: { options: JSON.stringify(optionsArray) }
      });
      count++;
    }
  }
  
  console.log(`Sanitization complete. Fixed ${count} questions.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
