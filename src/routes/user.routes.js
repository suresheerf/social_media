const express = require('express');

const router = express.Router();

const {
  followUser,
  unfollowUser,
  getUser
} = require('../controllers/userController');

router.post('/follow/:userId', followUser);
router.post('/unfollow/:userId', unfollowUser);
router.get('/user', getUser);

module.exports = router;
