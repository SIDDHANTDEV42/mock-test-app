import { Router } from 'express';
import { getUsers, getUserStats, deleteUsers, getLeaderboard } from '../controllers/user.controller';
import { authenticate, authorizeAdmin } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authenticate, authorizeAdmin, getUsers);
router.get('/leaderboard', authenticate, getLeaderboard);
router.get('/:id/stats', authenticate, getUserStats);
router.delete('/', authenticate, authorizeAdmin, deleteUsers);

export default router;
