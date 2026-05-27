import { Router } from 'express';
import { createQuestion, getQuestions, bulkCreateQuestions, getDashboardStats, getChapters, deleteQuestions, getAdminStats, getPYQs, getAdminResults } from '../controllers/question.controller';
import { authenticate, isAdmin } from '../middleware/auth.middleware';

const router = Router();

router.post('/', authenticate, createQuestion);
router.get('/', authenticate, getQuestions);
router.post('/bulk', authenticate, bulkCreateQuestions);
router.get('/stats', authenticate, getDashboardStats);
router.get('/chapters', authenticate, isAdmin, getChapters);
router.get('/pyq', authenticate, getPYQs);
router.get('/admin-results', authenticate, isAdmin, getAdminResults);
router.delete('/', authenticate, isAdmin, deleteQuestions);
router.get('/admin-stats', authenticate, isAdmin, getAdminStats);

export default router;
