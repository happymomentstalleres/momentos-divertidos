const mongoose = require('mongoose');

const configSchema = new mongoose.Schema({
  businessName: { type: String, default: 'Momentos Divertidos' },
  logoUrl: { type: String, default: '' },
  whatsappNumber: { type: String, default: '975335798' },
  contactEmail: { type: String, default: '' },
  deliveryCost: { type: Number, default: 10 },
  freeDeliveryZones: [{ type: String }],
  socialMedia: {
    instagram: { type: String, default: '' },
    facebook: { type: String, default: '' },
    tiktok: { type: String, default: '' },
    whatsapp: { type: String, default: '' },
  },
}, { timestamps: true });

module.exports = mongoose.model('Config', configSchema);
