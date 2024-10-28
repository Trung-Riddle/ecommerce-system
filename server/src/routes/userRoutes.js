const express = require('express');
const router = express.Router();
const {upload} = require('../middleware/uploadMiddleware');
const userControllers = require('../controllers/userController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.get('/current', authenticateToken, userControllers.getCurrentUser)


module.exports = router