import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { z } from 'zod';

const createReviewSchema = z.object({
    testId: z.string().min(1, 'Test is required'),
    content: z.string().trim().min(1, 'Review content is required').max(1000, 'Review is too long'),
    rating: z.number().int().min(1).max(5).optional(),
});

export const createReview = async (req: Request, res: Response) => {
    try {
        const result = createReviewSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({ error: result.error.issues[0]?.message || 'Validation failed' });
        }

        const { testId, content, rating } = result.data;
        const userId = (req as any).user.id;

        const test = await prisma.test.findUnique({ where: { id: testId }, select: { id: true } });
        if (!test) {
            return res.status(404).json({ error: 'Test not found' });
        }

        const review = await prisma.review.create({
            data: {
                content,
                rating,
                userId,
                testId
            }
        });
        res.status(201).json(review);
    } catch (error) {
        res.status(500).json({ error: 'Failed to submit review' });
    }
};

export const getReviews = async (req: Request, res: Response) => {
    try {
        const reviews = await prisma.review.findMany({
            include: {
                user: { select: { name: true, email: true } },
                test: { select: { title: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch reviews' });
    }
};
