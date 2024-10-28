const express = require("express");
const router = express.Router();
const { upload } = require("../middleware/uploadMiddleware");
const shopControllers = require("../controllers/shopController");
const { authenticateToken } = require("../middleware/authMiddleware");

router.post("/update-role", authenticateToken, shopControllers.updateRole);

module.exports = router;
