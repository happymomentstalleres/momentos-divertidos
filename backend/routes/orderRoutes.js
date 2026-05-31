const express = require('express');
const router = express.Router();
const { createOrder, getOrders, updateOrderStatus } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');
const { body } = require('express-validator');

const orderValidation = [
  body('customerName').notEmpty().withMessage('El nombre es requerido'),
  body('address').notEmpty().withMessage('La dirección es requerida'),
  body('items').isArray({ min: 1 }).withMessage('El carrito está vacío'),
];

router.post('/', orderValidation, createOrder);
router.get('/', protect, getOrders);
router.put('/:id/status', protect, updateOrderStatus);

module.exports = router;
