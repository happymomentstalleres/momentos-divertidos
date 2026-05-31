const mongoose = require('mongoose');

const promoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'El título es requerido'],
    trim: true,
  },
  subtitle: {
    type: String,
    trim: true,
    default: '',
  },
  description: {
    type: String,
    trim: true,
    default: '',
  },
  badgeText: {
    type: String,
    trim: true,
    default: '',         // ej: "2x1", "Oferta", "Nuevo"
  },
  ctaLabel: {
    type: String,
    default: 'Ver más',  // texto del botón
  },
  ctaUrl: {
    type: String,
    default: '/catalogo', // enlace del botón
  },
  bgColor: {
    type: String,
    default: '#3D2314',  // color de fondo del popup
  },
  active: {
    type: Boolean,
    default: true,
  },
  // Orden de prioridad: mayor número = más prioritario
  priority: {
    type: Number,
    default: 0,
  },
  // Fechas opcionales de vigencia
  startsAt: { type: Date, default: null },
  endsAt:   { type: Date, default: null },
}, { timestamps: true });

module.exports = mongoose.model('Promo', promoSchema);
