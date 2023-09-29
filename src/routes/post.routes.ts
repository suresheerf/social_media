import multer, { diskStorage } from 'multer';
import { Router } from 'express';
import { extension } from 'mime-types';

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

router.post('/posts', upload.single('image'), createPost);
router.route('/posts/:postId').get(getPost).delete(deletePost);
router.get('/like/:postId', likePost);
router.get('/unlike/:postId', unlikePost);
router.get('/posts', getAllPosts);
router.get('/feed', getFeed);

export default router;
