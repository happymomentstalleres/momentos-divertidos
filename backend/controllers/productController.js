const Product = require('../models/Product');
const { validationResult } = require('express-validator');
const path = require('path');
const fs = require('fs');

// Helper para construir la URL de imagen
const buildImageUrl = (req, filename) => {
  if (!filename) return '';
  return `${req.protocol}://${req.get('host')}/uploads/${filename}`;
};

// @desc    Obtener todos los productos (público, con filtros)
// @route   GET /api/products
const getProducts = async (req, res, next) => {
  try {
    const { category, search, featured, available = 'true', page = 1, limit = 20 } = req.query;
    const query = {};

    if (available === 'true') query.available = true;
    if (category) query.category = category;
    if (featured === 'true') query.isFeatured = true;
    if (search) query.$text = { $search: search };

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ products, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtener todos los productos para admin (sin filtro de disponible)
// @route   GET /api/products/admin
const getProductsAdmin = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search, category } = req.query;
    const query = {};
    if (category) query.category = category;
    if (search) query.$text = { $search: search };

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ products, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtener un producto por ID
// @route   GET /api/products/:id
const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Producto no encontrado' });
    res.json(product);
  } catch (error) {
    next(error);
  }
};

// @desc    Crear producto
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { name, price, shortDescription, longDescription, stock, category, tags, available, isFeatured } = req.body;

    let mainImage = '';
    let additionalImages = [];

    // if (req.files?.mainImage?.[0]) {
    //   mainImage = req.files.mainImage[0].filename;
    // }
    // if (req.files?.additionalImages) {
    //   additionalImages = req.files.additionalImages.map(f => f.filename);
    // }
    if (req.files?.mainImage?.[0]) {
      mainImage = req.files.mainImage[0].path
    }
    if (req.files?.additionalImages) {
      additionalImages = req.files.additionalImages.map(f => f.path)
    }

    const tagsArray = tags ? (Array.isArray(tags) ? tags : JSON.parse(tags)) : [];

    const product = await Product.create({
      name,
      price: Number(price),
      shortDescription,
      longDescription,
      stock: Number(stock) || 0,
      category,
      tags: tagsArray,
      available: available === 'true' || available === true,
      isFeatured: isFeatured === 'true' || isFeatured === true,
      mainImage,
      additionalImages,
    });

    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

// @desc    Actualizar producto
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Producto no encontrado' });

    const { name, price, shortDescription, longDescription, stock, category, tags, available, isFeatured, keepImages } = req.body;

    // Actualizar imagen principal si se sube una nueva
    if (req.files?.mainImage?.[0]) {
      // Eliminar imagen anterior si existe
      if (product.mainImage) {
        const oldPath = path.join(__dirname, '../uploads', product.mainImage);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      // product.mainImage = req.files.mainImage[0].filename;
      product.mainImage = req.files.mainImage[0].path
    }

    // Agregar imágenes adicionales
    if (req.files?.additionalImages) {
      const newImages = req.files.additionalImages.map(f => f.filename);
      // keepImages puede ser array de filenames a mantener
      const kept = keepImages ? (Array.isArray(keepImages) ? keepImages : JSON.parse(keepImages)) : product.additionalImages;
      product.additionalImages = [...kept, ...newImages].slice(0, 3);
    }

    const tagsArray = tags ? (Array.isArray(tags) ? tags : JSON.parse(tags)) : product.tags;

    product.name = name || product.name;
    product.price = price !== undefined ? Number(price) : product.price;
    product.shortDescription = shortDescription ?? product.shortDescription;
    product.longDescription = longDescription ?? product.longDescription;
    product.stock = stock !== undefined ? Number(stock) : product.stock;
    product.category = category || product.category;
    product.tags = tagsArray;
    product.available = available !== undefined ? (available === 'true' || available === true) : product.available;
    product.isFeatured = isFeatured !== undefined ? (isFeatured === 'true' || isFeatured === true) : product.isFeatured;

    const updated = await product.save();
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

// @desc    Eliminar producto
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Producto no encontrado' });

    // Eliminar imágenes del servidor
    const images = [product.mainImage, ...product.additionalImages].filter(Boolean);
    images.forEach(img => {
      const imgPath = path.join(__dirname, '../uploads', img);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    });

    await product.deleteOne();
    res.json({ message: 'Producto eliminado correctamente' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProducts, getProductsAdmin, getProduct, createProduct, updateProduct, deleteProduct };
