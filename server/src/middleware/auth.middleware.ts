import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import prisma from '../lib/prisma';

export interface AuthRequest extends Request {
    user?: {
        id: string;
        role: string;
    };
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    const decoded = verifyToken(token) as { userId: string } | null;

    if (!decoded || !decoded.userId) {
        return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: { id: true, role: true },
        });

        if (!user) {
            return res.status(401).json({ error: 'Unauthorized: User not found' });
        }

        req.user = { id: user.id, role: user.role };
        next();
    } catch (error) {
        console.error('Auth Middleware Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const isAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.user && req.user.role === 'ADMIN') {
        next();
    } else {
        res.status(403).json({ error: 'Forbidden: Admin access required' });
    }
};

export const authorizeAdmin = isAdmin;
