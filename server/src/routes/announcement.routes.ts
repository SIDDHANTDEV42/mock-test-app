import { Router } from 'express';
import { createAnnouncement, getAnnouncements, deleteAnnouncement } from '../controllers/announcement.controller';
import { authenticate, authorizeAdmin } from '../middleware/auth.middleware';

const router = Router();

router.post('/', authenticate, authorizeAdmin, createAnnouncement);
router.get('/', authenticate, getAnnouncements);
router.delete('/:id', authenticate, authorizeAdmin, deleteAnnouncement);

export default router;
