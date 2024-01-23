import { Router } from 'express';
import protect from '../middleware/auth';
import { followUser, unfollowUser, getUser, deleteUser } from '../controllers/userController';

const router = Router();

router.post('/follow/:userId', protect, followUser);
router.post('/unfollow/:userId', protect, unfollowUser);
router.get('/user', protect, getUser);
router.delete('/user', protect, deleteUser);

export default router;
