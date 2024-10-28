const express = require('express');
const router = express.Router();
const {upload, checkSingleFile} = require('../middleware/uploadMiddleware');
const categoryControllers = require('../controllers/CategoryController');
const { authenticateToken, isAdmin, isSeller } = require('../middleware/authMiddleware');

router.post('/create-category', authenticateToken, isSeller, upload.single('file'), categoryControllers.createParentCategory)
router.get('/get-all', categoryControllers.getAllCategories)


module.exports = router