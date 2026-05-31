const express = require('express');
const router = express.Router();
const {
  getProducts, getProductsAdmin, getProduct,
  createProduct, updateProduct, deleteProduct,
} = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');
const { uploadProductImages } = require('../middleware/uploadMiddleware');
const { body } = require('express-validator');

const productValidation = [
  body('name').notEmpty().withMessage('El nombre es requerido'),
  body('price').isNumeric().withMessage('El precio debe ser un número'),
  body('category').notEmpty().withMessage('La categoría es requerida'),
];

// Rutas públicas
router.get('/', getProducts);
router.get('/:id', getProduct);

// Rutas admin protegidas
router.get('/admin/all', protect, getProductsAdmin);
router.post('/', protect, uploadProductImages, productValidation, createProduct);
router.put('/:id', protect, uploadProductImages, updateProduct);
router.delete('/:id', protect, deleteProduct);

module.exports = router;
