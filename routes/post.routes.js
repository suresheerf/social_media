const express = require('express');

const router = express.Router();

const {
  createPost,
  getPost,
  getAllPosts,
  deletePost,
  likePost,
  unlikePost
} = require('../controllers/postController');

router.post('/posts', createPost);
router.route('/posts/:postId').get(getPost).delete(deletePost);
router.post('/like/:postId', likePost);
router.post('/unlike/:postId', unlikePost);
router.get('/all_posts', getAllPosts);

module.exports = router;
