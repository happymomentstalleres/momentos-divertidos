const errorHandler = (err, req, res, next) => {
  console.error('❌ Error:', err.message);

  // Error de Mongoose - ID inválido
  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'ID inválido' });
  }

  // Error de Mongoose - campo único duplicado
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({ message: `El ${field} ya está registrado` });
  }

  // Error de Multer
  if (err.name === 'MulterError') {
    return res.status(400).json({ message: `Error al subir archivo: ${err.message}` });
  }

  // Error de validación Mongoose
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({ message: messages.join(', ') });
  }

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message || 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = errorHandler;
