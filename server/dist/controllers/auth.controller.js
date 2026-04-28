"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.logout = exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma_1 = __importDefault(require("../lib/prisma"));
const auth_schema_1 = require("../schemas/auth.schema");
const jwt_1 = require("../utils/jwt");
const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};
const register = async (req, res) => {
    try {
        const result = auth_schema_1.registerSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({ error: result.error.errors });
        }
        const { email, password, name } = result.data;
        const existingUser = await prisma_1.default.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ error: 'User already exists' });
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const user = await prisma_1.default.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
            },
        });
        const token = (0, jwt_1.signToken)({ userId: user.id });
        res.cookie('token', token, COOKIE_OPTIONS);
        return res.status(201).json({
            message: 'User created successfully',
            user: { id: user.id, email: user.email, name: user.name, role: user.role },
        });
    }
    catch (error) {
        console.error('Register Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const result = auth_schema_1.loginSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({ error: result.error.errors });
        }
        const { email, password } = result.data;
        const user = await prisma_1.default.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const isValidPassword = await bcryptjs_1.default.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const token = (0, jwt_1.signToken)({ userId: user.id });
        res.cookie('token', token, COOKIE_OPTIONS);
        return res.status(200).json({
            message: 'Login successful',
            user: { id: user.id, email: user.email, name: user.name, role: user.role },
        });
    }
    catch (error) {
        console.error('Login Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.login = login;
const logout = (req, res) => {
    res.clearCookie('token', { ...COOKIE_OPTIONS, maxAge: 0 });
    return res.status(200).json({ message: 'Logged out successfully' });
};
exports.logout = logout;
const getMe = async (req, res) => {
    try {
        const user = await prisma_1.default.user.findUnique({
            where: { id: req.user?.id },
            select: { id: true, email: true, name: true, role: true },
        });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        return res.status(200).json({ user });
    }
    catch (error) {
        console.error('GetMe Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.getMe = getMe;
