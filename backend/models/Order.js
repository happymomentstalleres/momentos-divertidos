const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
});

const orderSchema = new mongoose.Schema({
  items: [orderItemSchema],
  subtotal: { type: Number, required: true },
  deliveryCost: { type: Number, default: 0 },
  grandTotal: { type: Number, required: true },
  customerName: { type: String, required: true, trim: true },
  address: { type: String, required: true, trim: true },
  reference: { type: String, trim: true, default: '' },
  status: {
    type: String,
    enum: ['pendiente', 'confirmado', 'en_preparacion', 'enviado', 'entregado', 'cancelado'],
    default: 'pendiente',
  },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
