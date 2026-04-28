import { Request, Response } from 'express';
import prisma from '../lib/prisma';

export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                stream: true,
                createdAt: true
            }
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
};

export const getUserStats = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const results = await prisma.result.findMany({
            where: { userId: id as string },
            include: { test: true },
            orderBy: { completedAt: 'desc' }
        });

        const subjectAggregates: Record<string, { correct: number; total: number }> = {};

        results.forEach(r => {
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
                    console.error("JSON Parse error in result stats:", e);
                }
            }
        });

        const weakAreas = Object.keys(subjectAggregates).map(subj => ({
            subject: subj,
            average: subjectAggregates[subj].total > 0
                ? (subjectAggregates[subj].correct / subjectAggregates[subj].total) * 100
                : 0
        })).sort((a, b) => a.average - b.average);

        // Calculate Average Time per Question for this user
        let totalQuestionsAnswered = 0;
        let totalTimeSpent = 0;
        results.forEach(r => {
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
            results,
            weakAreas: weakAreas.slice(0, 3), // Top 3 weakest
            avgTimePerQuestion // In seconds
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch user stats' });
    }
};

export const deleteUsers = async (req: Request, res: Response) => {
    try {
        const { ids } = req.body;
        if (!Array.isArray(ids)) return res.status(400).json({ error: 'IDs must be an array' });

        // Delete related records first to avoid FK constraint errors
        await prisma.result.deleteMany({ where: { userId: { in: ids } } });
        await prisma.review.deleteMany({ where: { userId: { in: ids } } });
        // Delete custom tests created by these users
        await prisma.test.deleteMany({ where: { userId: { in: ids }, isCustom: true } });
        await prisma.user.deleteMany({ where: { id: { in: ids } } });

        res.json({ message: `${ids.length} user(s) deleted successfully` });
    } catch (error) {
        console.error('Delete users error:', error);
        res.status(500).json({ error: 'Failed to delete users' });
    }
};

export const getLeaderboard = async (req: Request, res: Response) => {
    try {
        const users = await prisma.user.findMany({
            where: { role: 'STUDENT' },
            include: { results: true }
        });

        const leaderboard = users.map(u => {
            const totalScore = u.results.reduce((acc, curr) => acc + curr.score, 0);
            const testsTaken = u.results.length;
            const avgScore = testsTaken > 0 ? totalScore / testsTaken : 0;
            
            return {
                id: u.id,
                name: u.name,
                totalScore,
                testsTaken,
                avgScore: Math.round(avgScore)
            };
        })
        .filter(u => u.testsTaken > 0)
        .sort((a, b) => b.totalScore - a.totalScore)
        .slice(0, 50);

        res.json(leaderboard);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch leaderboard' });
    }
};
