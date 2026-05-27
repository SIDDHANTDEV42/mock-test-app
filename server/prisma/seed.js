const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding data...');

  // Create some questions with chapters
  const questions = [
    {
      text: "What is the unit of Force?",
      options: JSON.stringify(["Newton", "Joule", "Watt", "Pascal"]),
      correctAnswer: 0,
      subject: "Physics",
      chapter: "Laws of Motion"
    },
    {
      text: "Which element has atomic number 1?",
      options: JSON.stringify(["Helium", "Hydrogen", "Lithium", "Beryllium"]),
      correctAnswer: 1,
      subject: "Chemistry",
      chapter: "Periodic Table"
    },
    {
      text: "Derivative of sin(x) is?",
      options: JSON.stringify(["cos(x)", "-cos(x)", "tan(x)", "sec(x)"]),
      correctAnswer: 0,
      subject: "Mathematics",
      chapter: "Calculus"
    }
  ];

  for (const q of questions) {
    await prisma.question.create({ data: q });
  }

  // Create a Mock Test
  const q1 = await prisma.question.findFirst({ where: { subject: "Physics" } });
  const q2 = await prisma.question.findFirst({ where: { subject: "Chemistry" } });

  await prisma.test.create({
    data: {
      title: "MHT CET Full Mock 1",
      description: "Comprehensive mock test for MHT CET preparation.",
      duration: 180,
      type: "MOCK",
      correctPoints: 4,
      negativePoints: 1,
      questions: {
        connect: [{ id: q1.id }, { id: q2.id }]
      }
    }
  });

  console.log('Seeding finished!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
