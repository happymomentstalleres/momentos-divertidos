const upload = require('../config/multer');

// Middleware para subir imagen principal + hasta 3 adicionales
const uploadProductImages = upload.fields([
  { name: 'mainImage', maxCount: 1 },
  { name: 'additionalImages', maxCount: 3 },
]);

// Middleware para subir logo
const uploadLogo = upload.single('logo');

module.exports = { uploadProductImages, uploadLogo };
