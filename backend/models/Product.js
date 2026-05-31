const mongoose = require('mongoose');

const CATEGORIES = [
  'Postres tradicionales',
  'Chocolates',
  'Bocaditos dulces',
  'Bocaditos salados',
  'Pays',
  'Desayunos sorpresa',
  'Alfajores',
  'Brownies',
  'Tortas',
  'Postres saludables',
  'Regalos',
];

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre es requerido'],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, 'El precio es requerido'],
    min: [0, 'El precio no puede ser negativo'],
  },
  shortDescription: {
    type: String,
    trim: true,
    maxlength: 200,
  },
  longDescription: {
    type: String,
    trim: true,
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
  category: {
    type: String,
    required: [true, 'La categoría es requerida'],
    enum: CATEGORIES,
  },
  // Tags: nuevo, oferta, mas_vendido, ultimas_unidades
  tags: [{
    type: String,
    enum: ['nuevo', 'oferta', 'mas_vendido', 'ultimas_unidades'],
  }],
  available: {
    type: Boolean,
    default: true,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  mainImage: {
    type: String,
    default: '',
  },
  additionalImages: [{
    type: String,
  }],
}, { timestamps: true });

// Índice de texto para búsqueda
productSchema.index({ name: 'text', shortDescription: 'text' });

module.exports = mongoose.model('Product', productSchema);
module.exports.CATEGORIES = CATEGORIES;
