const express = require('express');
const router = express.Router();
const { getConfig, updateConfig } = require('../controllers/configController');
const { protect } = require('../middleware/authMiddleware');
const { uploadLogo } = require('../middleware/uploadMiddleware');

router.get('/', getConfig);
router.put('/', protect, uploadLogo, updateConfig);

module.exports = router;
