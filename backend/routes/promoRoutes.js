const express = require('express');
const router = express.Router();
const { getActivePromos, getPromos, createPromo, updatePromo, deletePromo } = require('../controllers/promoController');
const { protect } = require('../middleware/authMiddleware');

// Pública
router.get('/active', getActivePromos);

// Admin protegidas
router.get('/',       protect, getPromos);
router.post('/',      protect, createPromo);
router.put('/:id',   protect, updatePromo);
router.delete('/:id',protect, deletePromo);

module.exports = router;
