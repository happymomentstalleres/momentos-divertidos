const Config = require('../models/Config');
const path = require('path');
const fs = require('fs');

// @desc    Obtener configuración
// @route   GET /api/config
// @access  Public
const getConfig = async (req, res, next) => {
  try {
    let config = await Config.findOne();
    if (!config) {
      config = await Config.create({
        businessName: 'Momentos Divertidos',
        whatsappNumber: '975335798',
        deliveryCost: 10,
        freeDeliveryZones: ['Plaza de Armas', 'Parque Alameda de Moquegua'],
      });
    }
    res.json(config);
  } catch (error) {
    next(error);
  }
};

// @desc    Actualizar configuración
// @route   PUT /api/config
// @access  Private/Admin
const updateConfig = async (req, res, next) => {
  try {
    const { businessName, whatsappNumber, contactEmail, deliveryCost, freeDeliveryZones, socialMedia } = req.body;

    let config = await Config.findOne();
    if (!config) config = new Config();

    if (businessName) config.businessName = businessName;
    if (whatsappNumber) config.whatsappNumber = whatsappNumber;
    if (contactEmail !== undefined) config.contactEmail = contactEmail;
    if (deliveryCost !== undefined) config.deliveryCost = Number(deliveryCost);
    if (freeDeliveryZones) {
      config.freeDeliveryZones = Array.isArray(freeDeliveryZones)
        ? freeDeliveryZones
        : JSON.parse(freeDeliveryZones);
    }
    if (socialMedia) {
      config.socialMedia = typeof socialMedia === 'string' ? JSON.parse(socialMedia) : socialMedia;
    }

    // Logo
    if (req.file) {
      if (config.logoUrl) {
        const oldPath = path.join(__dirname, '../uploads', config.logoUrl);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      config.logoUrl = req.file.filename;
    }

    await config.save();
    res.json(config);
  } catch (error) {
    next(error);
  }
};

module.exports = { getConfig, updateConfig };
