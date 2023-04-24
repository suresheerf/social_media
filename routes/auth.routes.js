const express = require('express');

const router = express.Router();

const { signin } = require('../controllers/authController');

router.post('/authenticate', signin);

module.exports = router;
