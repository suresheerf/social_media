import { Router } from 'express';

import { followUser, unfollowUser, getUser } from '../controllers/userController';

const router = Router();

router.post('/follow/:userId', followUser);
router.post('/unfollow/:userId', unfollowUser);
router.get('/user', getUser);

export default router;
