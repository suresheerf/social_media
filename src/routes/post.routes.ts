import multer, { diskStorage } from 'multer';
import { Router } from 'express';
import { extension } from 'mime-types';
import protect from '../middleware/auth';

import {
  createPost,
  getPost,
  getAllPosts,
  deletePost,
  likePost,
  unlikePost,
  getFeed,
} from '../controllers/postController';

const storage = diskStorage({
  destination(req, file, cb) {
    cb(null, './public');
  },
  filename(req, file, cb) {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${file.fieldname}-${uniqueSuffix}.${extension(file.mimetype)}`);
  },
});

const upload = multer({ storage });

const router = Router();

router.post('/posts', protect, upload.single('image'), createPost);
router.route('/posts/:postId').get(protect, getPost).delete(protect, deletePost);
router.get('/like/:postId', protect, likePost);
router.get('/unlike/:postId', protect, unlikePost);
router.get('/posts', protect, getAllPosts);
router.get('/feed', protect, getFeed);

export default router;
