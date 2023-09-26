const multer = require('multer');
const path = require('path');
const express = require('express');
const mime = require('mime-types');

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, './public');
  },
  filename(req, file, cb) {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${file.fieldname}-${uniqueSuffix}.${mime.extension(file.mimetype)}`);
  },
});

const upload = multer({ storage });

const router = express.Router();

const {
  createPost,
  getPost,
  getAllPosts,
  deletePost,
  likePost,
  unlikePost,
  getFeed,
} = require('../controllers/postController');

router.post('/posts', upload.single('image'), createPost);
router.route('/posts/:postId').get(getPost).delete(deletePost);
router.get('/like/:postId', likePost);
router.get('/unlike/:postId', unlikePost);
router.get('/posts', getAllPosts);
router.get('/feed', getFeed);

module.exports = router;
