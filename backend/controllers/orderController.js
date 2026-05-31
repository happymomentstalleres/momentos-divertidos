const Order = require('../models/Order');
const Config = require('../models/Config');
const { validationResult } = require('express-validator');

// @desc    Crear pedido
// @route   POST /api/orders
// @access  Public
const createOrder = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { items, customerName, address, reference } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'El carrito está vacío' });
    }

    // Obtener costo de delivery desde config
    const config = await Config.findOne();
    const deliveryCost = config?.deliveryCost || 10;

    const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const grandTotal = subtotal + deliveryCost;

    const order = await Order.create({
      items,
      subtotal,
      deliveryCost,
      grandTotal,
      customerName,
      address,
      reference: reference || '',
      status: 'pendiente',
    });

    res.status(201).json({
      order,
      whatsappNumber: config?.whatsappNumber || '975335798',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtener todos los pedidos (admin)
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const query = status ? { status } : {};

    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ orders, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    next(error);
  }
};

// @desc    Actualizar estado de pedido
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    if (!order) return res.status(404).json({ message: 'Pedido no encontrado' });
    res.json(order);
  } catch (error) {
    next(error);
  }
};

module.exports = { createOrder, getOrders, updateOrderStatus };
