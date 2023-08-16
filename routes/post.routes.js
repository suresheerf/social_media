const express = require('express');

const router = express.Router();

const {
  createPost,
  getPost,
  getAllPosts,
  deletePost,
  likePost,
  unlikePost,
  getFeed
} = require('../controllers/postController');

router.post('/posts', createPost);
router.route('/posts/:postId').get(getPost).delete(deletePost);
router.post('/like/:postId', likePost);
router.post('/unlike/:postId', unlikePost);
router.get('/posts', getAllPosts);
router.get('/feed',getFeed)

module.exports = router;
