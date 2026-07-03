import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { createTestSchema, createCustomTestSchema, submitResultSchema } from '../schemas/test.schema';
import { AppError } from '../middleware/error.middleware';
import { logger } from '../lib/logger';

const parseOptions = (options: string) => {
    try {
        return JSON.parse(options);
    } catch {
        return [];
    }
};

const parseSubjectMarks = (subjectMarks?: string | null) => {
    if (!subjectMarks) return null;
    try {
        return JSON.parse(subjectMarks);
    } catch {
        return null;
    }
};

const sanitizeQuestionForExam = (question: any, includeAnswer: boolean) => {
    const { correctAnswer, ...safeQuestion } = question;
    return {
        ...(includeAnswer ? question : safeQuestion),
        options: typeof question.options === 'string' ? parseOptions(question.options) : question.options
    };
};

const isTestAvailable = (test: any) => {
    const now = new Date();
    if (test.isLocked) return false;
    if (test.startTime && new Date(test.startTime) > now) return false;
    if (test.endTime && new Date(test.endTime) <= now) return false;
    if (!test.isAlwaysAvailable && !test.startTime && !test.endTime) return false;
    return true;
};

export const createTest = async (req: Request, res: Response, next: any) => {
    try {
        const result = createTestSchema.safeParse(req.body);
        if (!result.success) {
            const firstError = result.error.issues[0]?.message || 'Validation failed';
            throw new AppError(firstError, 400);
        }

        const { title, description, duration, questionIds, correctPoints, negativePoints, type, startTime, endTime, isLocked, isAlwaysAvailable, subjectMarks } = result.data;
        const test = await prisma.test.create({
            data: {
                title,
                description,
                duration,
                type: type || "MOCK",
                correctPoints: correctPoints !== undefined ? correctPoints : 4,
                negativePoints: negativePoints !== undefined ? negativePoints : 1,
                startTime: startTime ? new Date(startTime) : null,
                endTime: endTime ? new Date(endTime) : null,
                isLocked: isLocked || false,
                isAlwaysAvailable: isAlwaysAvailable !== undefined ? isAlwaysAvailable : true,
                subjectMarks: subjectMarks || null,
                questions: {
                    connect: questionIds.map((id: string) => ({ id }))
                }
            }
        });
        res.status(201).json(test);
    } catch (error) {
        logger.error('Failed to create test', error);
        next(error);
    }
};

export const getTest = async (req: Request, res: Response, next: any) => {
    try {
        const id = req.params.id as string;
        if (!id) {
            throw new AppError('Test ID is required', 400);
        }
        const test = await prisma.test.findUnique({
            where: { id },
            include: { questions: true }
        });

        if (!test) return res.status(404).json({ error: 'Test not found' });

        const user = (req as any).user;
        if (!isTestAvailable(test) && user?.role !== 'ADMIN') {
            return res.status(403).json({ 
                error: 'Test is not currently available', 
                startTime: test.startTime 
            });
        }

        const testWithQuestions = test as any;

        res.json({
            ...testWithQuestions,
            questions: testWithQuestions.questions.map((q: any) => sanitizeQuestionForExam(q, user?.role === 'ADMIN'))
        });
    } catch (error) {
        logger.error('Failed to fetch test', error);
        next(error);
    }
};

export const getTests = async (req: Request, res: Response, next: any) => {
    try {
        const tests = await prisma.test.findMany({
            where: { isCustom: false },
            include: { questions: true }
        });
        const user = (req as any).user;
        res.json(tests.map((t: any) => ({
            ...t,
            questions: t.questions.map((q: any) => sanitizeQuestionForExam(q, user?.role === 'ADMIN'))
        })));
    } catch (error) {
        logger.error('Failed to fetch tests', error);
        next(error);
    }
};

export const submitResult = async (req: Request, res: Response, next: any) => {
    try {
        const { id } = req.params;
        if (!id) {
            throw new AppError('Test ID is required', 400);
        }

        const validationResult = submitResultSchema.safeParse(req.body);
        if (!validationResult.success) {
            const firstError = validationResult.error.issues[0]?.message || 'Validation failed';
            throw new AppError(firstError, 400);
        }

        const { answers, spentTime, timePerQuestion } = validationResult.data;
        const user = (req as any).user;
        if (!user?.id) {
            throw new AppError('User not authenticated', 401);
        }
        const userId = user.id;

        const test = await prisma.test.findUnique({
            where: { id: id as string },
            include: { questions: true }
        });

        if (!test) {
            throw new AppError('Test not found', 404);
        }

        if (!isTestAvailable(test) && user.role !== 'ADMIN') {
            throw new AppError('Test is not currently accepting submissions', 403);
        }

        let score = 0;
        const pos = test.correctPoints ?? 4;
        const neg = test.negativePoints ?? 1;
        const customMarks = parseSubjectMarks(test.subjectMarks);
        const subjectStats: Record<string, { correct: number; wrong: number; total: number }> = {};
        const wrongQuestions: string[] = [];

        test.questions.forEach((q: any, index: number) => {
            const subject = q.subject || 'General';
            const selected = answers[String(index)];
            const correctPoints = customMarks?.[subject]?.correct ?? pos;
            const negativePoints = customMarks?.[subject]?.negative ?? neg;

            if (!subjectStats[subject]) {
                subjectStats[subject] = { correct: 0, wrong: 0, total: 0 };
            }
            subjectStats[subject].total++;

            if (selected === q.correctAnswer) {
                score += correctPoints;
                subjectStats[subject].correct++;
            } else if (selected !== undefined) {
                score -= negativePoints;
                subjectStats[subject].wrong++;
                wrongQuestions.push(q.id);
            }
        });

        const result = await prisma.result.create({
            data: {
                score,
                spentTime,
                userId,
                testId: id as string,
                wrongQuestions: JSON.stringify(wrongQuestions),
                subjectStats: JSON.stringify(subjectStats),
                timePerQuestion: timePerQuestion ? JSON.stringify(timePerQuestion) : null
            }
        });
        res.status(201).json(result);
    } catch (error) {
        logger.error('Failed to submit result', error);
        next(error);
    }
};

export const getMyResults = async (req: Request, res: Response, next: any) => {
    try {
        const user = (req as any).user;
        if (!user?.id) {
            throw new AppError('User not authenticated', 401);
        }
        const userId = user.id;
        const results = await prisma.result.findMany({
            where: { userId },
            include: { test: true },
            orderBy: { completedAt: 'desc' }
        });
        res.json(results);
    } catch (error) {
        logger.error('Failed to fetch results', error);
        next(error);
    }
};

export const getResult = async (req: Request, res: Response, next: any) => {
    try {
        const { id } = req.params;
        if (!id) {
            throw new AppError('Result ID is required', 400);
        }
        const result = await prisma.result.findUnique({
            where: { id: id as string },
            include: { 
                test: {
                    include: { questions: true }
                } 
            }
        });
        if (!result) {
            throw new AppError('Result not found', 404);
        }

        const user = (req as any).user;
        if (result.userId !== user?.id && user?.role !== 'ADMIN') {
            throw new AppError('Unauthorized to view this result', 403);
        }

        res.json(result);
    } catch (error) {
        logger.error('Failed to fetch result detail', error);
        next(error);
    }
};

export const createCustomTest = async (req: Request, res: Response, next: any) => {
    try {
        const result = createCustomTestSchema.safeParse(req.body);
        if (!result.success) {
            const firstError = result.error.issues[0]?.message || 'Validation failed';
            throw new AppError(firstError, 400);
        }

        const { subjects, chapters, questionCount, title, duration, isPYQOnly, priority, level } = result.data;
        const user = (req as any).user;
        if (!user?.id) {
            throw new AppError('User not authenticated', 401);
        }
        const userId = user.id;

        const where: any = {};
        if (subjects && subjects.length > 0) where.subject = { in: subjects };
        if (chapters && chapters.length > 0) where.chapter = { in: chapters };
        if (level) where.level = level;
        if (isPYQOnly) where.isPYQ = true;

        let orderBy: any = {};
        if (priority === 'NEWEST') orderBy = { year: 'desc' };
        else if (priority === 'OLDEST') orderBy = { year: 'asc' };

        const questions = await prisma.question.findMany({
            where,
            orderBy: (priority === 'NEWEST' || priority === 'OLDEST') ? orderBy : undefined,
            take: (priority === 'NEWEST' || priority === 'OLDEST') ? questionCount : undefined
        });

        let finalQuestions = questions;
        if (!priority || priority === 'RANDOM') {
            finalQuestions = questions.sort(() => 0.5 - Math.random()).slice(0, questionCount);
        }

        const test = await prisma.test.create({
            data: {
                title,
                description: `Custom test generated by user`,
                duration,
                isCustom: true,
                userId,
                questions: {
                    connect: finalQuestions.map((q: any) => ({ id: q.id }))
                }
            }
        });
        res.status(201).json(test);
    } catch (error) {
        logger.error('Failed to create custom test', error);
        next(error);
    }
};

export const deleteTests = async (req: Request, res: Response, next: any) => {
    try {
        const { ids } = req.body;
        logger.info('Admin attempting to delete tests');
        
        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ error: 'No test IDs provided or invalid format' });
        }
        
        // Execute deletions in a transaction for safety
        await prisma.$transaction(async (tx: any) => {
            // 1. Delete dependent records
            await tx.result.deleteMany({ where: { testId: { in: ids } } });
            await tx.review.deleteMany({ where: { testId: { in: ids } } });
            
            // 2. Disconnect many-to-many questions (safety step for Prisma)
            for (const id of ids) {
                await tx.test.update({
                    where: { id },
                    data: {
                        questions: { set: [] } // Clears all links in join table
                    }
                });
            }
            
            // 3. Delete the tests
            await tx.test.deleteMany({ where: { id: { in: ids } } });
        });

        logger.info('Tests deleted successfully');
        res.json({ message: 'Tests deleted successfully' });
    } catch (error: any) {
        logger.error('Failed to delete tests', error);
        next(error);
    }
};

export const unlockTest = async (req: Request, res: Response, next: any) => {
    try {
        const { id } = req.params;
        if (!id) {
            throw new AppError('Test ID is required', 400);
        }
        const test = await prisma.test.update({
            where: { id: id as string },
            data: { isLocked: false, isAlwaysAvailable: true }
        });
        res.json(test);
    } catch (error) {
        logger.error('Failed to unlock test', error);
        next(error);
    }
};

export const startTest = async (req: Request, res: Response, next: any) => {
    try {
        const { id } = req.params;
        if (!id) {
            throw new AppError('Test ID is required', 400);
        }
        logger.info('Force starting test');
        const test = await prisma.test.update({
            where: { id: id as string },
            data: { 
                startTime: new Date(),
                endTime: null, // Clear end time so it doesn't immediately expire
                isLocked: false,
                isAlwaysAvailable: true
            }
        });
        res.json(test);
    } catch (error) {
        logger.error('Failed to start test', error);
        next(error);
    }
};

export const endTest = async (req: Request, res: Response, next: any) => {
    try {
        const { id } = req.params;
        if (!id) {
            throw new AppError('Test ID is required', 400);
        }
        logger.info('Force ending test');
        const test = await prisma.test.update({
            where: { id: id as string },
            data: { 
                endTime: new Date()
            }
        });
        res.json(test);
    } catch (error) {
        logger.error('Failed to end test', error);
        next(error);
    }
};
