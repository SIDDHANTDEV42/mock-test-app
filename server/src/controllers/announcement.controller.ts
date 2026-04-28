import { Request, Response } from 'express';
import prisma from '../lib/prisma';

export const createAnnouncement = async (req: Request, res: Response) => {
    try {
        const { title, content } = req.body;
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
        const { id } = req.params;
        await prisma.announcement.delete({ where: { id } });
        res.json({ message: 'Announcement deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete announcement' });
    }
};
