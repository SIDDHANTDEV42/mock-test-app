const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const DEMO_PASSWORD = 'DemoPass123!';
const ADMIN_EMAIL = 'demo.admin@siddhant.dev';
const STUDENT_EMAIL = 'demo.student@siddhant.dev';

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

const templates = {
  Physics: [
    ['Which principle is most directly used in {chapter}?', ['Conservation laws', 'Taxonomy', 'Neutralization', 'Genetic drift'], 0],
    ['In a standard entrance question from {chapter}, which quantity is usually treated as a vector?', ['Velocity', 'Mass', 'Temperature', 'Time'], 0],
    ['A graph-based problem in {chapter} most often tests your ability to identify:', ['Slope and area', 'Valency', 'Functional groups', 'Cell organelles'], 0],
    ['For numerical questions in {chapter}, the safest first step is to:', ['Write given data with SI units', 'Memorize the answer', 'Skip unit conversion', 'Ignore signs'], 0],
  ],
  Chemistry: [
    ['A question from {chapter} most likely requires checking:', ['Mole ratio and charge balance', 'Projectile range', 'Matrix order', 'Food chain length'], 0],
    ['Which idea is central to {chapter}?', ['Structure-property relationship', 'Uniform circular motion', 'Binomial theorem', 'Natural selection only'], 0],
    ['In {chapter}, a wrong answer often comes from ignoring:', ['Oxidation state or units', 'Direction of magnetic field only', 'Triangle similarity', 'Population density'], 0],
    ['For reaction-based problems in {chapter}, first identify the:', ['Reactants and limiting reagent', 'Axis of symmetry', 'Image distance', 'Taxonomic rank'], 0],
  ],
  Mathematics: [
    ['A typical problem in {chapter} primarily tests:', ['Logical transformation of expressions', 'Atomic radius trends', 'Lens formula', 'Enzyme action'], 0],
    ['While solving {chapter}, the most useful habit is to:', ['Check domain and conditions', 'Ignore signs', 'Round every value early', 'Use only memory'], 0],
    ['Which tool is most common in {chapter}?', ['Algebraic simplification', 'Titration curve', 'Free-body diagram', 'Pedigree chart'], 0],
    ['A mistake in {chapter} usually happens when students skip:', ['Boundary cases', 'Valency', 'SI conversion', 'Food web labels'], 0],
  ],
  Biology: [
    ['A direct question from {chapter} usually asks for:', ['Function and identification', 'Matrix determinant', 'Ohm law', 'Mole fraction'], 0],
    ['Which approach helps most in {chapter}?', ['Diagram plus keyword recall', 'Only formula substitution', 'Only quadratic factorization', 'Only oxidation numbers'], 0],
    ['In {chapter}, assertion-reason questions mainly test:', ['Concept links', 'Projectile motion', 'Integration by parts', 'Equivalent resistance'], 0],
    ['Which phrase best fits {chapter}?', ['Structure supports function', 'Force equals mass times acceleration', 'Roots sum and product', 'pH is seven always'], 0],
  ],
};

function optionsFor(correct, seed) {
  const distractors = [
    'Only memorized facts',
    'Random guessing',
    'Ignoring units',
    'Skipping diagrams',
    'Using one formula everywhere',
    'Reading only options',
  ];
  const opts = [correct];
  let cursor = seed;
  while (opts.length < 4) {
    const item = distractors[cursor % distractors.length];
    if (!opts.includes(item)) opts.push(item);
    cursor += 1;
  }
  return opts;
}

function buildQuestions() {
  const questions = [];

  for (const [subject, chapters] of Object.entries(subjects)) {
    for (let i = 0; i < 100; i += 1) {
      const chapter = chapters[i % chapters.length];
      const template = templates[subject][i % templates[subject].length];
      const text = template[0].replace('{chapter}', chapter);
      const level = i % 3 === 0 ? 'Easy' : i % 3 === 1 ? 'Medium' : 'Hard';
      questions.push({
        text: `[Showcase] ${subject} Q${String(i + 1).padStart(3, '0')}: ${text}`,
        options: JSON.stringify(optionsFor(template[1][0], i)),
        correctAnswer: 0,
        subject,
        chapter,
        level,
        year: 2026,
        isPYQ: false,
        imageUrl: null,
      });
    }
  }

  const pyqYears = [2019, 2020, 2021, 2022, 2023, 2024];
  let pyqCount = 0;
  for (const [subject, chapters] of Object.entries(subjects)) {
    for (let i = 0; i < 15; i += 1) {
      pyqCount += 1;
      const chapter = chapters[(i + 3) % chapters.length];
      questions.push({
        text: `[Showcase PYQ] ${subject} PYQ ${String(pyqCount).padStart(2, '0')}: Previous-year style problem from ${chapter}.`,
        options: JSON.stringify(optionsFor('Exam-style concept application', i + pyqCount)),
        correctAnswer: 0,
        subject,
        chapter,
        level: i % 2 === 0 ? 'MHT-CET' : 'JEE',
        year: pyqYears[i % pyqYears.length],
        isPYQ: true,
        imageUrl: null,
      });
    }
  }

  return questions;
}

async function resetShowcaseData() {
  const showcaseTests = await prisma.test.findMany({
    where: { title: { startsWith: 'Showcase' } },
    select: { id: true },
  });
  const showcaseTestIds = showcaseTests.map(test => test.id);

  await prisma.result.deleteMany({
    where: {
      OR: [
        { testId: { in: showcaseTestIds } },
        { user: { email: { in: [ADMIN_EMAIL, STUDENT_EMAIL] } } },
      ],
    },
  });
  await prisma.review.deleteMany({
    where: {
      OR: [
        { testId: { in: showcaseTestIds } },
        { user: { email: { in: [ADMIN_EMAIL, STUDENT_EMAIL] } } },
      ],
    },
  });

  for (const testId of showcaseTestIds) {
    await prisma.test.update({
      where: { id: testId },
      data: { questions: { set: [] } },
    }).catch(() => null);
  }

  await prisma.test.deleteMany({ where: { id: { in: showcaseTestIds } } });
  await prisma.question.deleteMany({
    where: {
      OR: [
        { text: { startsWith: '[Showcase]' } },
        { text: { startsWith: '[Showcase PYQ]' } },
      ],
    },
  });
  await prisma.announcement.deleteMany({ where: { title: { startsWith: 'Showcase' } } });
  await prisma.user.deleteMany({ where: { email: { in: [ADMIN_EMAIL, STUDENT_EMAIL] } } });
}

async function createUsers() {
  const password = await bcrypt.hash(DEMO_PASSWORD, 10);
  const admin = await prisma.user.create({
    data: {
      email: ADMIN_EMAIL,
      password,
      name: 'Siddhant Demo Admin',
      role: 'ADMIN',
      isGlobalAdmin: true,
      stream: 'PCMB',
    },
  });
  const student = await prisma.user.create({
    data: {
      email: STUDENT_EMAIL,
      password,
      name: 'Portfolio Demo Student',
      role: 'STUDENT',
      stream: 'PCM',
    },
  });
  return { admin, student };
}

async function createTests(questionMap) {
  const allRegular = Object.values(questionMap).flat().filter(q => !q.isPYQ);
  const allPyq = Object.values(questionMap).flat().filter(q => q.isPYQ);
  const tests = [];

  const connect = questions => questions.map(q => ({ id: q.id }));
  const pick = (pool, start, count) => pool.slice(start, start + count);

  for (let i = 0; i < 6; i += 1) {
    tests.push(await prisma.test.create({
      data: {
        title: `Showcase Mock Test ${i + 1}`,
        description: 'Full-length portfolio demo mock test with mixed Physics, Chemistry, Mathematics, and Biology questions.',
        duration: 120,
        type: 'MOCK',
        correctPoints: 4,
        negativePoints: 1,
        isAlwaysAvailable: true,
        questions: { connect: connect(pick(allRegular, i * 45, 60)) },
      },
    }));
  }

  const normalSubjects = Object.keys(subjects);
  for (let i = 0; i < 8; i += 1) {
    const subject = normalSubjects[i % normalSubjects.length];
    const pool = questionMap[subject].filter(q => !q.isPYQ);
    tests.push(await prisma.test.create({
      data: {
        title: `Showcase ${subject} Chapter Test ${i + 1}`,
        description: `Focused normal practice test for ${subject}, built to keep the dashboard populated for reviewers.`,
        duration: 45,
        type: 'NORMAL',
        correctPoints: 4,
        negativePoints: 1,
        isAlwaysAvailable: true,
        questions: { connect: connect(pick(pool, (i * 10) % 70, 30)) },
      },
    }));
  }

  for (let i = 0; i < 4; i += 1) {
    tests.push(await prisma.test.create({
      data: {
        title: `Showcase PYQ Archive Paper ${i + 1}`,
        description: 'Previous-year question archive paper for the portfolio PYQ section.',
        duration: 60,
        type: 'PYQ',
        correctPoints: 4,
        negativePoints: 1,
        isAlwaysAvailable: true,
        questions: { connect: connect(pick(allPyq, i * 12, 15)) },
      },
    }));
  }

  return tests;
}

async function createShowcaseExtras(student, tests) {
  await prisma.announcement.create({
    data: {
      title: 'Showcase: Full Demo Dataset Loaded',
      content: 'This portfolio build includes demo users, full question banks, mock tests, normal tests, PYQ papers, results, and analytics.',
    },
  });
  await prisma.announcement.create({
    data: {
      title: 'Showcase: Reviewer Credentials Available',
      content: 'Use the visible login buttons to explore both student and admin workflows safely.',
    },
  });

  const firstTest = tests.find(test => test.type === 'MOCK') || tests[0];
  if (firstTest) {
    await prisma.result.create({
      data: {
        userId: student.id,
        testId: firstTest.id,
        score: 156,
        spentTime: 4380,
        wrongQuestions: JSON.stringify([]),
        subjectStats: JSON.stringify({
          Physics: { correct: 11, wrong: 3, total: 15 },
          Chemistry: { correct: 12, wrong: 2, total: 15 },
          Mathematics: { correct: 10, wrong: 4, total: 15 },
          Biology: { correct: 9, wrong: 3, total: 15 },
        }),
        timePerQuestion: JSON.stringify({ 0: 65, 1: 72, 2: 55, 3: 91 }),
      },
    });
    await prisma.review.create({
      data: {
        userId: student.id,
        testId: firstTest.id,
        rating: 5,
        content: 'Polished demo experience with useful analytics and a realistic test flow.',
      },
    });
  }
}

async function main() {
  console.log('Resetting showcase data...');
  await resetShowcaseData();

  console.log('Creating demo users...');
  const { student } = await createUsers();

  console.log('Creating question bank...');
  const createdQuestions = [];
  for (const question of buildQuestions()) {
    createdQuestions.push(await prisma.question.create({ data: question }));
  }

  const questionMap = createdQuestions.reduce((acc, question) => {
    if (!acc[question.subject]) acc[question.subject] = [];
    acc[question.subject].push(question);
    return acc;
  }, {});

  console.log('Creating showcase tests...');
  const tests = await createTests(questionMap);

  console.log('Creating announcements, sample result, and review...');
  await createShowcaseExtras(student, tests);

  console.log(`Seed complete:
  demo admin:   ${ADMIN_EMAIL} / ${DEMO_PASSWORD}
  demo student: ${STUDENT_EMAIL} / ${DEMO_PASSWORD}
  questions:    ${createdQuestions.length}
  tests:        ${tests.length}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
