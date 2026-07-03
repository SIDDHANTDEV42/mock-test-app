import { NextFunction, Request, Response } from 'express';

const unsafeMethods = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);
const defaultAllowedOrigins = [
    'http://localhost:3000',
    'https://examprep-showcase.vercel.app',
];
const vercelPreviewOriginPattern = /^https:\/\/examprep-showcase-[a-z0-9-]+\.vercel\.app$/;

const allowedOrigins = () => {
    const origins = [
        process.env.CORS_ORIGIN,
        process.env.CORS_ALLOWED_ORIGINS,
        ...defaultAllowedOrigins,
    ];

    return new Set(
        origins
            .flatMap(origin => (origin || '').split(','))
            .map(origin => origin.trim())
            .filter(Boolean)
    );
};

const isAllowedOrigin = (origin: string) => {
    return allowedOrigins().has(origin) || vercelPreviewOriginPattern.test(origin);
};

export const csrfProtection = (req: Request, res: Response, next: NextFunction) => {
    if (!unsafeMethods.has(req.method)) {
        return next();
    }

    const origin = req.get('origin');
    const referer = req.get('referer');
    const allowed = allowedOrigins();

    if (origin) {
        if (allowed.has(origin) || isAllowedOrigin(origin)) return next();
        return res.status(403).json({ error: 'Forbidden: invalid request origin' });
    }

    if (referer) {
        try {
            const refererOrigin = new URL(referer).origin;
            if (allowed.has(refererOrigin) || isAllowedOrigin(refererOrigin)) return next();
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
