import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { z } from 'zod';

const createAnnouncementSchema = z.object({
    title: z.string().trim().min(1, 'Title is required').max(120, 'Title is too long'),
    content: z.string().trim().min(1, 'Content is required').max(2000, 'Content is too long'),
});

export const createAnnouncement = async (req: Request, res: Response) => {
    try {
        const result = createAnnouncementSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({ error: result.error.issues[0]?.message || 'Validation failed' });
        }

        const { title, content } = result.data;
        const announcement = await prisma.announcement.create({
            data: { title, content }
        });
        res.status(201).json(announcement);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create announcement' });
    }
};

export const getAnnouncements = async (req: Request, res: Response) => {
    try {
        const announcements = await prisma.announcement.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(announcements);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch announcements' });
    }
};

export const deleteAnnouncement = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        await prisma.announcement.delete({ where: { id } });
        res.json({ message: 'Announcement deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete announcement' });
    }
};
