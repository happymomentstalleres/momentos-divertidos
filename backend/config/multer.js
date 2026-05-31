const cloudinary = require('cloudinary').v2
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const multer = require('multer')

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'momentos-divertidos',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 800, quality: 'auto' }],
  },
})

const upload = multer({ storage })

module.exports = upload
// const multer = require('multer');
// const path = require('path');

// // Configuración de almacenamiento
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, path.join(__dirname, '../uploads'));
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
//     const ext = path.extname(file.originalname);
//     cb(null, `img-${uniqueSuffix}${ext}`);
//   },
// });

// // Filtro: solo imágenes
// const fileFilter = (req, file, cb) => {
//   const allowed = /jpeg|jpg|png|webp|gif/;
//   const ext = allowed.test(path.extname(file.originalname).toLowerCase());
//   const mime = allowed.test(file.mimetype);
//   if (ext && mime) {
//     cb(null, true);
//   } else {
//     cb(new Error('Solo se permiten imágenes (jpeg, jpg, png, webp, gif)'));
//   }
// };

// const upload = multer({
//   storage,
//   fileFilter,
//   limits: { fileSize: 5 * 1024 * 1024 }, // 5MB máximo
// });

// module.exports = upload;
