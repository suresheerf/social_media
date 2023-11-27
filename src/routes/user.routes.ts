import { Router } from 'express';
import protect from '../middleware/auth';
import { followUser, unfollowUser, getUser } from '../controllers/userController';

const router = Router();

router.post('/follow/:userId', protect, followUser);
router.post('/unfollow/:userId', protect, unfollowUser);
router.get('/user', protect, getUser);

export default router;
