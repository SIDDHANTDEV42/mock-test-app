import { Router } from 'express';
import { getUsers, getUserStats, deleteUsers, getLeaderboard } from '../controllers/user.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authenticate, getUsers);
router.get('/leaderboard', authenticate, getLeaderboard);
router.get('/:id/stats', authenticate, getUserStats);
router.delete('/', authenticate, deleteUsers);

export default router;
