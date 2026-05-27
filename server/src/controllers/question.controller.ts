import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { createQuestionSchema, bulkCreateQuestionsSchema } from '../schemas/question.schema';
import { AppError } from '../middleware/error.middleware';
import { logger } from '../lib/logger';

export const createQuestion = async (req: Request, res: Response, next: any) => {
    try {
        const result = createQuestionSchema.safeParse(req.body);
        if (!result.success) {
            const firstError = result.error.issues[0]?.message || 'Validation failed';
            throw new AppError(firstError, 400);
        }

        const { text, options, correctAnswer, subject, chapter, level, imageUrl, year, isPYQ } = result.data;
        const question = await prisma.question.create({
            data: {
                text,
                options: JSON.stringify(options),
                correctAnswer,
                subject,
                chapter: chapter || null,
                level: level || null,
                imageUrl: imageUrl || null,
                year: year !== undefined ? (typeof year === 'number' ? year : parseInt(year)) : null,
                isPYQ: isPYQ || false
            }
        });
        res.status(201).json(question);
    } catch (error) {
        logger.error('Failed to create question', error);
        next(error);
    }
};

export const getQuestions = async (req: Request, res: Response, next: any) => {
    try {
        const questions = await prisma.question.findMany();
        res.json(questions.map((q: any) => {
            let options;
            try { options = JSON.parse(q.options); } catch { options = []; }
            return { ...q, options };
        }));
    } catch (error) {
        logger.error('Failed to fetch questions', error);
        next(error);
    }
};

export const bulkCreateQuestions = async (req: Request, res: Response, next: any) => {
    try {
        const result = bulkCreateQuestionsSchema.safeParse(req.body);
        if (!result.success) {
            const firstError = result.error.issues[0]?.message || 'Validation failed';
            throw new AppError(firstError, 400);
        }

        const { questions, isCSV, globalIsPYQ, globalYear, globalLevel } = result.data;
        let questionsToProcess = questions;

        if (isCSV && typeof questions === 'string') {
            const lines = (questions as string).split('\n').filter((line: string) => line.trim());
            questionsToProcess = [];
            
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i].trim();
                const parts = line.split('|');
                
                // Super forgiving parser - minimum is just text + options (at least 1 pipe)
                if (parts.length < 2) {
                    throw new Error(`Line ${i + 1} looks incomplete. Needs at least 1 pipe (|) between the question text and options. You wrote: "${line.substring(0, 30)}..."`);
                }

                const text = parts[0]?.trim();
                const optsStr = parts[1]?.trim() || "Option A, Option B, Option C, Option D";
                const options = optsStr.split(',').map((o: string) => o.trim());
                
                let correctAnswer = parseInt(parts[2]?.trim());
                if (isNaN(correctAnswer) || correctAnswer < 0 || correctAnswer >= options.length) {
                    correctAnswer = 0; // Default to first option if invalid
                }
                
                const subject = parts[3]?.trim() || "General";
                const chapter = parts[4]?.trim() || "Miscellaneous";
                const level = globalLevel || parts[5]?.trim() || "JEE";
                
                const rawYear = globalYear || parts[6]?.trim();
                const year = rawYear ? (typeof rawYear === 'number' ? rawYear : parseInt(rawYear)) : null;
                
                const isPYQ = globalIsPYQ || parts[7]?.trim() === 'true';

                questionsToProcess.push({
                    text,
                    options,
                    correctAnswer,
                    subject,
                    chapter,
                    level,
                    year,
                    isPYQ
                });
            }
        }

        if (!Array.isArray(questionsToProcess) || questionsToProcess.length === 0) {
            return res.status(400).json({ error: 'No valid questions found to process.' });
        }
        
        const results = await Promise.all(questionsToProcess.map((q: any) => 
            prisma.question.create({
                data: {
                    text: q.text,
                    options: JSON.stringify(q.options),
                    correctAnswer: q.correctAnswer,
                    subject: q.subject,
                    chapter: q.chapter,
                    level: q.level,
                    imageUrl: null,
                    year: isNaN(q.year) ? null : q.year,
                    isPYQ: q.isPYQ
                }
            })
        ));
        res.status(201).json({ count: results.length, ids: results.map((r: any) => r.id) });
    } catch (error: any) {
        logger.error('Bulk upload error', error);
        next(error);
    }
};

export const getDashboardStats = async (req: Request, res: Response, next: any) => {
    try {
        const user = (req as any).user;
        if (!user?.id) {
            throw new AppError('User not authenticated', 401);
        }
        const userId = user.id;
        const totalTests = await prisma.test.count({ where: { isCustom: false } });
        const totalQuestions = await prisma.question.count();
        
        // Fetch all results to calculate accurate stats
        const allUserResults = await prisma.result.findMany({
            where: { userId },
            orderBy: { completedAt: 'desc' },
            include: { test: true }
        });

        const testsCompleted = allUserResults.length;
        
        const averageScore = testsCompleted > 0 
            ? allUserResults.reduce((acc: number, curr: any) => acc + curr.score, 0) / testsCompleted 
            : 0;

        const subjectAggregates: Record<string, { correct: number; total: number }> = {};
        allUserResults.forEach((r: any) => {
            if (r.subjectStats) {
                try {
                    let stats = r.subjectStats;
                    // Handle potential double stringification
                    while (typeof stats === 'string') {
                        stats = JSON.parse(stats);
                    }
                    
                    if (stats && typeof stats === 'object') {
                        Object.keys(stats).forEach(subj => {
                            const subjData = (stats as any)[subj];
                            if (subjData && typeof subjData === 'object') {
                                if (!subjectAggregates[subj]) subjectAggregates[subj] = { correct: 0, total: 0 };
                                subjectAggregates[subj].correct += subjData.correct || 0;
                                subjectAggregates[subj].total += subjData.total || 0;
                            }
                        });
                    }
                } catch (e) {
                    logger.error('JSON Parse error in dashboard stats', e);
                }
            }
        });

        const subjectPerformance = Object.keys(subjectAggregates).map(subj => ({
            name: subj,
            score: subjectAggregates[subj].total > 0 
                ? Math.round((subjectAggregates[subj].correct / subjectAggregates[subj].total) * 100) 
                : 0
        }));

        // Calculate Average Time per Question
        let totalQuestionsAnswered = 0;
        let totalTimeSpent = 0;
        allUserResults.forEach((r: any) => {
            totalTimeSpent += r.spentTime;
            if (r.timePerQuestion) {
                try {
                    const tpq = typeof r.timePerQuestion === 'string' ? JSON.parse(r.timePerQuestion) : r.timePerQuestion;
                    totalQuestionsAnswered += Object.keys(tpq).length;
                } catch (e) {}
            }
        });

        const avgTimePerQuestion = totalQuestionsAnswered > 0 
            ? Math.round(totalTimeSpent / totalQuestionsAnswered) 
            : 0;

        res.json({
            totalTests,
            totalQuestions,
            averageScore,
            testsCompleted,
            subjectPerformance,
            avgTimePerQuestion,
            recentResults: allUserResults.slice(0, 5)
        });
    } catch (error) {
        logger.error('Failed to fetch dashboard stats', error);
        next(error);
    }
};

export const getChapters = async (req: Request, res: Response, next: any) => {
    try {
        const { subject } = req.query;
        const whereClause = subject ? { subject: subject as string } : {};
        const chapters = await prisma.question.findMany({
            where: whereClause,
            select: { chapter: true },
            distinct: ['chapter']
        });
        res.json(chapters.map((c: any) => c.chapter).filter(Boolean));
    } catch (error) {
        logger.error('Failed to fetch chapters', error);
        next(error);
    }
};

export const getPYQs = async (req: Request, res: Response, next: any) => {
    try {
        const pyqs = await prisma.question.findMany({
            where: { isPYQ: true },
            orderBy: { year: 'desc' }
        });
        
        // Grouping: Subject -> Chapter -> Year
        const hierarchy: any = {};
        pyqs.forEach((q: any) => {
            const sub = q.subject || "Other";
            const chap = q.chapter || "General";
            const year = q.year || "Unknown";
            
            if (!hierarchy[sub]) hierarchy[sub] = {};
            if (!hierarchy[sub][chap]) hierarchy[sub][chap] = {};
            if (!hierarchy[sub][chap][year]) hierarchy[sub][chap][year] = [];
            
            let options;
            try { options = JSON.parse(q.options); } catch { options = []; }
            hierarchy[sub][chap][year].push({ ...q, options });
        });
        
        res.json(hierarchy);
    } catch (error) {
        logger.error('Failed to fetch PYQs', error);
        next(error);
    }
};

export const deleteQuestions = async (req: Request, res: Response, next: any) => {
    try {
        const { ids } = req.body;
        if (!Array.isArray(ids)) {
            throw new AppError('IDs must be an array', 400);
        }
        
        await prisma.question.deleteMany({
            where: { id: { in: ids } }
        });
        res.json({ message: 'Questions deleted successfully' });
    } catch (error) {
        logger.error('Failed to delete questions', error);
        next(error);
    }
};

export const getAdminStats = async (req: Request, res: Response, next: any) => {
    try {
        const [questionCount, testCount, userCount, resultCount] = await Promise.all([
            prisma.question.count(),
            prisma.test.count({ where: { isCustom: false } }),
            prisma.user.count(),
            prisma.result.count()
        ]);
        res.json({ questionCount, testCount, userCount, resultCount });
    } catch (error) {
        logger.error('Failed to fetch admin stats', error);
        next(error);
    }
};

export const getAdminResults = async (req: Request, res: Response, next: any) => {
    try {
        const results = await prisma.result.findMany({
            include: {
                user: { select: { name: true, email: true } },
                test: { select: { title: true, type: true } }
            },
            orderBy: { completedAt: 'desc' }
        });
        res.json(results);
    } catch (error) {
        logger.error('Failed to fetch all results', error);
        next(error);
    }
};
