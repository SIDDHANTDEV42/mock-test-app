"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rateLimiter = void 0;
const store = {};
const rateLimiter = (options) => {
    return (req, res, next) => {
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
        }
        else {
            store[ip] = { count: 1, startTime: now };
        }
        next();
    };
};
exports.rateLimiter = rateLimiter;
