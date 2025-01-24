export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  if (err.name === 'AppError') {
    return res.status(err.statusCode).json({
      error: err.message
    });
  }

  if (err.name === 'ZodError') {
    return res.status(400).json({
      error: 'Datos de entrada inválidos',
      details: err.errors
    });
  }

  res.status(500).json({
    error: 'Error interno del servidor'
  });
};