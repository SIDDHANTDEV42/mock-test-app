import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../lib/prisma';
import { loginSchema, registerSchema } from '../schemas/auth.schema';
import { signToken } from '../utils/jwt';
import { AuthRequest } from '../middleware/auth.middleware';

const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export const register = async (req: Request, res: Response) => {
    try {
        console.log('Registering user:', { email: req.body.email, name: req.body.name });
        const result = registerSchema.safeParse(req.body);
        if (!result.success) {
            console.warn('Registration validation failed:', result.error.issues);
            const firstError = result.error.issues[0]?.message || 'Validation failed';
            return res.status(400).json({ error: firstError });
        }

        const { email, password, name, stream } = result.data;

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ error: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name: name || '',
                stream: stream || null,
            },
        });

        const token = signToken({ userId: user.id });

        res.cookie('token', token, COOKIE_OPTIONS);

        return res.status(201).json({
            message: 'User created successfully',
            user: { id: user.id, email: user.email, name: user.name, role: user.role },
        });
    } catch (error) {
        console.error('Register Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const result = loginSchema.safeParse(req.body);
        if (!result.success) {
            const firstError = result.error.issues[0]?.message || 'Validation failed';
            return res.status(400).json({ error: firstError });
        }

        const { email, password } = result.data;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = signToken({ userId: user.id });

        res.cookie('token', token, COOKIE_OPTIONS);

        return res.status(200).json({
            message: 'Login successful',
            user: { id: user.id, email: user.email, name: user.name, role: user.role },
        });
    } catch (error) {
        console.error('Login Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const logout = (req: Request, res: Response) => {
    res.clearCookie('token', { ...COOKIE_OPTIONS, maxAge: 0 });
    return res.status(200).json({ message: 'Logged out successfully' });
};

export const getMe = async (req: AuthRequest, res: Response) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user?.id },
            select: { id: true, email: true, name: true, role: true },
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        return res.status(200).json({ user });
    } catch (error) {
        console.error('GetMe Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};
