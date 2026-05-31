const Promo = require('../models/Promo');

// @desc  Obtener promos activas (público – para el popup de la tienda)
// @route GET /api/promos/active
const getActivePromos = async (req, res, next) => {
  try {
    const now = new Date();
    const promos = await Promo.find({
      active: true,
      $or: [
        { startsAt: null, endsAt: null },
        { startsAt: { $lte: now }, endsAt: { $gte: now } },
        { startsAt: { $lte: now }, endsAt: null },
        { startsAt: null, endsAt: { $gte: now } },
      ],
    }).sort({ priority: -1, createdAt: -1 });

    res.json(promos);
  } catch (error) {
    next(error);
  }
};

// @desc  Obtener todas las promos (admin)
// @route GET /api/promos
const getPromos = async (req, res, next) => {
  try {
    const promos = await Promo.find().sort({ priority: -1, createdAt: -1 });
    res.json(promos);
  } catch (error) {
    next(error);
  }
};

// @desc  Crear promo
// @route POST /api/promos
const createPromo = async (req, res, next) => {
  try {
    const { title, subtitle, description, badgeText, ctaLabel, ctaUrl, bgColor, active, priority, startsAt, endsAt } = req.body;
    const promo = await Promo.create({
      title, subtitle, description, badgeText, ctaLabel, ctaUrl,
      bgColor: bgColor || '#3D2314',
      active: active !== undefined ? active : true,
      priority: priority || 0,
      startsAt: startsAt || null,
      endsAt: endsAt || null,
    });
    res.status(201).json(promo);
  } catch (error) {
    next(error);
  }
};

// @desc  Actualizar promo
// @route PUT /api/promos/:id
const updatePromo = async (req, res, next) => {
  try {
    const promo = await Promo.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!promo) return res.status(404).json({ message: 'Anuncio no encontrado' });
    res.json(promo);
  } catch (error) {
    next(error);
  }
};

// @desc  Eliminar promo
// @route DELETE /api/promos/:id
const deletePromo = async (req, res, next) => {
  try {
    const promo = await Promo.findByIdAndDelete(req.params.id);
    if (!promo) return res.status(404).json({ message: 'Anuncio no encontrado' });
    res.json({ message: 'Anuncio eliminado' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getActivePromos, getPromos, createPromo, updatePromo, deletePromo };
