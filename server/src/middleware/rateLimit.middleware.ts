import { Request, Response, NextFunction } from 'express';

interface RateLimitStore {
    [key: string]: {
        count: number;
        startTime: number;
    };
}

const store: RateLimitStore = {};

export const rateLimiter = (options: { windowMs: number; max: number }) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const ip = req.ip || req.socket.remoteAddress || 'unknown';
        const now = Date.now();

        if (!store[ip]) {
            store[ip] = { count: 1, startTime: now };
            return next();
        }

        const windowStart = store[ip].startTime;

        if (now - windowStart < options.windowMs) {
            if (store[ip].count >= options.max) {
                return res.status(429).json({
                    error: 'Too many requests, please try again later.',
                });
            }
            store[ip].count++;
        } else {
            store[ip] = { count: 1, startTime: now };
        }

        next();
    };
};
