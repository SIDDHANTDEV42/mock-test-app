const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
async function main() {
  const allTests = await prisma.test.findMany()
  console.log('All Tests:', allTests.length)
  console.log('Official Tests:', allTests.filter(t => !t.isCustom).length)
  console.log('Custom Tests:', allTests.filter(t => t.isCustom).length)
  console.log('Tests list:', allTests.map(t => ({ id: t.id, title: t.title, isCustom: t.isCustom })))
  process.exit(0)
}
main()
