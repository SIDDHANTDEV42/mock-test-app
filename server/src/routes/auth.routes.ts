import { Router } from 'express';
import { register, login, logout, getMe, googleLogin, forgotPassword, resetPassword } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';
import { rateLimiter } from '../middleware/rateLimit.middleware';

const router = Router();

const authLimiter = rateLimiter({ windowMs: 15 * 60 * 1000, max: 100 }); // 15 mins, 100 requests

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/logout', logout);
router.get('/me', authenticate, getMe);
router.post('/google', authLimiter, googleLogin);
router.post('/forgot-password', authLimiter, forgotPassword);
router.post('/reset-password', authLimiter, resetPassword);

export default router;
