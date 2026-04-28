import { Request, Response } from 'express';
import prisma from '../lib/prisma';

export const createReview = async (req: Request, res: Response) => {
    try {
        const { testId, content, rating } = req.body;
        const userId = (req as any).user.id;

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
