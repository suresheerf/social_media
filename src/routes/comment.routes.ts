import express from 'express';
import protect from '../middleware/auth';
import createComment from '../controllers/commentController';

const router = express.Router();

router.post('/comment/:postId', protect, createComment);

export default router;
