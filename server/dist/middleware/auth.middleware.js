"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jwt_1 = require("../utils/jwt");
const prisma_1 = __importDefault(require("../lib/prisma"));
const authenticate = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }
    const decoded = (0, jwt_1.verifyToken)(token);
    if (!decoded || !decoded.userId) {
        return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
    try {
        const user = await prisma_1.default.user.findUnique({
            where: { id: decoded.userId },
            select: { id: true, role: true },
        });
        if (!user) {
            return res.status(401).json({ error: 'Unauthorized: User not found' });
        }
        req.user = { id: user.id, role: user.role };
        next();
    }
    catch (error) {
        console.error('Auth Middleware Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.authenticate = authenticate;
