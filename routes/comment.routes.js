const express = require('express');

const router = express.Router();

const { createComment } = require('../controllers/commentController');

router.post('/comment/:postId', createComment);

module.exports = router;
