import { Router } from 'express';
import { createTest, getTests, getTest, submitResult, getMyResults, createCustomTest, deleteTests, getResult, unlockTest, startTest, endTest } from '../controllers/test.controller';
import { authenticate, authorizeAdmin } from '../middleware/auth.middleware';

const router = Router();

router.post('/', authenticate, createTest);
router.get('/', authenticate, getTests);
router.get('/results/me', authenticate, getMyResults);
router.get('/results/:id', authenticate, getResult);
router.get('/:id', authenticate, getTest);
router.post('/custom', authenticate, createCustomTest);
router.post('/:id/results', authenticate, submitResult);
router.patch('/:id/unlock', authenticate, authorizeAdmin, unlockTest);
router.patch('/:id/start', authenticate, authorizeAdmin, startTest);
router.patch('/:id/end', authenticate, authorizeAdmin, endTest);
router.delete('/', authenticate, authorizeAdmin, deleteTests);

export default router;
