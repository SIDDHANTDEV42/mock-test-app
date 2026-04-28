import { Request, Response } from 'express';
import prisma from '../lib/prisma';

export const createTest = async (req: Request, res: Response) => {
    try {
        const { title, description, duration, questionIds, correctPoints, negativePoints, type, startTime, endTime, isLocked, isAlwaysAvailable, subjectMarks } = req.body;
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
        res.status(500).json({ error: 'Failed to create test' });
    }
};

export const getTest = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        const test = await prisma.test.findUnique({
            where: { id },
            include: { questions: true }
        });

        if (!test) return res.status(404).json({ error: 'Test not found' });

        // Scheduling check
        const now = new Date();
        if (test.isLocked && test.startTime && new Date(test.startTime) > now && (req as any).user.role !== 'ADMIN') {
            return res.status(403).json({ 
                error: 'Test is not yet available', 
                startTime: test.startTime 
            });
        }

        const testWithQuestions = test as any;

        res.json({
            ...testWithQuestions,
            questions: testWithQuestions.questions.map((q: any) => {
                let options;
                try { 
                    options = typeof q.options === 'string' ? JSON.parse(q.options) : q.options; 
                } catch { 
                    options = []; 
                }
                return { ...q, options };
            })
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch test' });
    }
};

export const getTests = async (req: Request, res: Response) => {
    try {
        const tests = await prisma.test.findMany({
            where: { isCustom: false },
            include: { questions: true }
        });
        res.json(tests.map(t => ({
            ...t,
            questions: t.questions.map(q => {
                let options;
                try { options = JSON.parse(q.options); } catch { options = []; }
                return { ...q, options };
            })
        })));
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch tests' });
    }
};

export const submitResult = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { score, spentTime, wrongQuestions, subjectStats, timePerQuestion } = req.body;
        const userId = (req as any).user.id;

        const result = await prisma.result.create({
            data: {
                score,
                spentTime,
                userId,
                testId: id as string,
                wrongQuestions: wrongQuestions ? (typeof wrongQuestions === 'string' ? wrongQuestions : JSON.stringify(wrongQuestions)) : null,
                subjectStats: subjectStats ? (typeof subjectStats === 'string' ? subjectStats : JSON.stringify(subjectStats)) : null,
                timePerQuestion: timePerQuestion ? (typeof timePerQuestion === 'string' ? timePerQuestion : JSON.stringify(timePerQuestion)) : null
            }
        });
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ error: 'Failed to submit result' });
    }
};

export const getMyResults = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const results = await prisma.result.findMany({
            where: { userId },
            include: { test: true },
            orderBy: { completedAt: 'desc' }
        });
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch results' });
    }
};

export const getResult = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await prisma.result.findUnique({
            where: { id: id as string },
            include: { 
                test: {
                    include: { questions: true }
                } 
            }
        });
        if (!result) return res.status(404).json({ error: 'Result not found' });
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch result detail' });
    }
};

export const createCustomTest = async (req: Request, res: Response) => {
    try {
        const { subjects, chapters, questionCount, title, duration, isPYQOnly, priority } = req.body;
        const userId = (req as any).user.id;

        const where: any = {};
        if (subjects && subjects.length > 0) where.subject = { in: subjects };
        if (chapters && chapters.length > 0) where.chapter = { in: chapters };
        if (req.body.level) where.level = req.body.level;
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
                    connect: finalQuestions.map(q => ({ id: q.id }))
                }
            }
        });
        res.status(201).json(test);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create advanced custom test' });
    }
};

export const deleteTests = async (req: Request, res: Response) => {
    try {
        const { ids } = req.body;
        console.log('Admin attempting to delete tests:', ids);
        
        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ error: 'No test IDs provided or invalid format' });
        }
        
        // Execute deletions in a transaction for safety
        await prisma.$transaction(async (tx) => {
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

        console.log('Tests deleted successfully');
        res.json({ message: 'Tests deleted successfully' });
    } catch (error: any) {
        console.error('CRITICAL Delete tests error:', error);
        res.status(500).json({ 
            error: 'Failed to delete tests', 
            details: error.message 
        });
    }
};

export const unlockTest = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const test = await prisma.test.update({
            where: { id: id as string },
            data: { isLocked: false, isAlwaysAvailable: true }
        });
        res.json(test);
    } catch (error) {
        res.status(500).json({ error: 'Failed to unlock test' });
    }
};

export const startTest = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        console.log('Force starting test:', id);
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
        console.error('Start test error:', error);
        res.status(500).json({ error: 'Failed to start test' });
    }
};

export const endTest = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        console.log('Force ending test:', id);
        const test = await prisma.test.update({
            where: { id: id as string },
            data: { 
                endTime: new Date()
            }
        });
        res.json(test);
    } catch (error) {
        console.error('End test error:', error);
        res.status(500).json({ error: 'Failed to end test' });
    }
};

