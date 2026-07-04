const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const MIN_MOCK_QUESTIONS = 50;
const TARGET_MOCK_QUESTIONS = 60;
const MOCK_TEST_COUNT = 6;

const subjects = {
  Physics: [
    'Units and Measurements',
    'Motion in a Straight Line',
    'Laws of Motion',
    'Work Power Energy',
    'Gravitation',
    'Waves',
    'Electrostatics',
    'Current Electricity',
    'Ray Optics',
    'Modern Physics',
  ],
  Chemistry: [
    'Atomic Structure',
    'Periodic Table',
    'Chemical Bonding',
    'Thermodynamics',
    'Equilibrium',
    'Solutions',
    'Electrochemistry',
    'Organic Chemistry',
    'Coordination Compounds',
    'Biomolecules',
  ],
  Mathematics: [
    'Sets and Relations',
    'Quadratic Equations',
    'Sequences and Series',
    'Trigonometry',
    'Limits',
    'Differentiation',
    'Integration',
    'Vectors',
    'Probability',
    'Matrices',
  ],
  Biology: [
    'Cell Structure',
    'Biomolecules',
    'Plant Physiology',
    'Human Physiology',
    'Genetics',
    'Evolution',
    'Ecology',
    'Biotechnology',
    'Reproduction',
    'Diversity in Living World',
  ],
};

const templates = [
  'Which concept is most important in {chapter}?',
  'A standard entrance question from {chapter} mainly checks:',
  'What is the safest first step while solving {chapter}?',
  'Which mistake should be avoided in {chapter}?',
];

const options = [
  'Read the concept carefully and apply it',
  'Guess without checking the question',
  'Ignore the given data',
  'Skip all diagrams and units',
];

function buildQuestionBank() {
  const questions = [];

  for (const [subject, chapters] of Object.entries(subjects)) {
    for (let i = 0; i < 100; i += 1) {
      const chapter = chapters[i % chapters.length];
      const template = templates[i % templates.length].replace('{chapter}', chapter);

      questions.push({
        text: `[Showcase] ${subject} Q${String(i + 1).padStart(3, '0')}: ${template}`,
        options: JSON.stringify(options),
        correctAnswer: 0,
        subject,
        chapter,
        level: i % 3 === 0 ? 'Easy' : i % 3 === 1 ? 'Medium' : 'Hard',
        year: 2026,
        isPYQ: false,
        imageUrl: null,
      });
    }
  }

  return questions;
}

function rotatePick(pool, start, count) {
  const picked = [];
  for (let i = 0; i < count; i += 1) {
    picked.push(pool[(start + i) % pool.length]);
  }
  return picked;
}

async function ensureQuestions() {
  const requiredQuestions = buildQuestionBank();
  const requiredTexts = requiredQuestions.map(question => question.text);
  const existingQuestions = await prisma.question.findMany({
    where: { text: { in: requiredTexts } },
    select: { id: true, text: true },
  });
  const existingTexts = new Set(existingQuestions.map(question => question.text));
  const missingQuestions = requiredQuestions.filter(question => !existingTexts.has(question.text));

  if (missingQuestions.length > 0) {
    await prisma.question.createMany({ data: missingQuestions });
  }

  return prisma.question.findMany({
    where: { text: { in: requiredTexts }, isPYQ: false },
    orderBy: [{ subject: 'asc' }, { text: 'asc' }],
  });
}

async function ensureMockTests(questionPool) {
  if (questionPool.length < MIN_MOCK_QUESTIONS) {
    throw new Error(`Only ${questionPool.length} showcase questions are available. Need at least ${MIN_MOCK_QUESTIONS}.`);
  }

  for (let i = 0; i < MOCK_TEST_COUNT; i += 1) {
    const title = `Showcase Mock Test ${i + 1}`;
    const selectedQuestions = rotatePick(questionPool, i * TARGET_MOCK_QUESTIONS, TARGET_MOCK_QUESTIONS);
    const questionLinks = selectedQuestions.map(question => ({ id: question.id }));

    const existingTest = await prisma.test.findFirst({
      where: { title, isCustom: false },
      include: { questions: { select: { id: true } } },
    });

    if (!existingTest) {
      await prisma.test.create({
        data: {
          title,
          description: 'Full-length portfolio demo mock test with mixed Physics, Chemistry, Mathematics, and Biology questions.',
          duration: 120,
          type: 'MOCK',
          correctPoints: 4,
          negativePoints: 1,
          isAlwaysAvailable: true,
          questions: { connect: questionLinks },
        },
      });
      continue;
    }

    if (existingTest.questions.length < MIN_MOCK_QUESTIONS) {
      await prisma.test.update({
        where: { id: existingTest.id },
        data: {
          type: 'MOCK',
          isAlwaysAvailable: true,
          questions: { set: questionLinks },
        },
      });
    }
  }
}

async function main() {
  const questions = await ensureQuestions();
  await ensureMockTests(questions);
  console.log(`Showcase mock tests verified with at least ${MIN_MOCK_QUESTIONS} questions each.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
