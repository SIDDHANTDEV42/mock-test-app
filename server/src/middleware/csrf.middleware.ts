import { NextFunction, Request, Response } from 'express';

const unsafeMethods = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

const allowedOrigins = () => {
    const origins = [process.env.CORS_ORIGIN || 'http://localhost:3000'];
    const extra = process.env.CORS_ALLOWED_ORIGINS;
    if (extra) {
        origins.push(...extra.split(',').map(origin => origin.trim()).filter(Boolean));
    }
    return new Set(origins);
};

export const csrfProtection = (req: Request, res: Response, next: NextFunction) => {
    if (!unsafeMethods.has(req.method)) {
        return next();
    }

    const origin = req.get('origin');
    const referer = req.get('referer');
    const allowed = allowedOrigins();

    if (origin) {
        if (allowed.has(origin)) return next();
        return res.status(403).json({ error: 'Forbidden: invalid request origin' });
    }

    if (referer) {
        try {
            const refererOrigin = new URL(referer).origin;
            if (allowed.has(refererOrigin)) return next();
        } catch {
            return res.status(403).json({ error: 'Forbidden: invalid request referer' });
        }
        return res.status(403).json({ error: 'Forbidden: invalid request referer' });
    }

    if (process.env.NODE_ENV === 'production') {
        return res.status(403).json({ error: 'Forbidden: missing request origin' });
    }

    return next();
};
