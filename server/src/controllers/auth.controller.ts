import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../lib/prisma';
import { loginSchema, registerSchema } from '../schemas/auth.schema';
import { signToken } from '../utils/jwt';
import { AuthRequest } from '../middleware/auth.middleware';
import { OAuth2Client } from 'google-auth-library';
import crypto from 'crypto';
import { logger } from '../lib/logger';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export const register = async (req: Request, res: Response, next: any) => {
    try {
        logger.info('Registering user');
        const result = registerSchema.safeParse(req.body);
        if (!result.success) {
            logger.warn('Registration validation failed');
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
        logger.error('Register Error', error);
        next(error);
    }
};

export const login = async (req: Request, res: Response, next: any) => {
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
        logger.error('Login Error', error);
        next(error);
    }
};

export const logout = (req: Request, res: Response) => {
    res.clearCookie('token', { ...COOKIE_OPTIONS, maxAge: 0 });
    return res.status(200).json({ message: 'Logged out successfully' });
};

export const getMe = async (req: AuthRequest, res: Response, next: any) => {
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
        logger.error('GetMe Error', error);
        next(error);
    }
};

export const googleLogin = async (req: Request, res: Response, next: any) => {
    try {
        const { credential } = req.body;
        const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        if (!payload || !payload.email) return res.status(400).json({ error: 'Invalid Google Token' });

        const email = payload.email;
        let user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            user = await prisma.user.create({
                data: {
                    email,
                    password: '', 
                    name: payload.name || '',
                },
            });
        }

        const token = signToken({ userId: user.id });
        res.cookie('token', token, COOKIE_OPTIONS);

        return res.status(200).json({
            message: 'Google login successful',
            user: { id: user.id, email: user.email, name: user.name, role: user.role },
        });
    } catch (error) {
        logger.error('Google Login Error', error);
        next(error);
    }
};

export const forgotPassword = async (req: Request, res: Response, next: any) => {
    try {
        const { email } = req.body;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.status(404).json({ error: 'User not found' });

        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

        await prisma.user.update({
            where: { email },
            data: { resetToken, resetTokenExpiry },
        });

        const resetLink = `${process.env.CORS_ORIGIN || 'http://localhost:3000'}/auth/reset-password?token=${resetToken}`;
        logger.info(`Password reset link generated: ${resetLink}`);

        return res.status(200).json({ message: 'Password reset link generated. Check server logs.' });
    } catch (error) {
        logger.error('Forgot password error', error);
        next(error);
    }
};

export const resetPassword = async (req: Request, res: Response, next: any) => {
    try {
        const { token, newPassword } = req.body;
        const user = await prisma.user.findFirst({
            where: {
                resetToken: token,
                resetTokenExpiry: { gt: new Date() },
            },
        });

        if (!user) return res.status(400).json({ error: 'Invalid or expired token' });

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                resetToken: null,
                resetTokenExpiry: null,
            },
        });

        return res.status(200).json({ message: 'Password has been reset successfully' });
    } catch (error) {
        logger.error('Reset password error', error);
        next(error);
    }
};
