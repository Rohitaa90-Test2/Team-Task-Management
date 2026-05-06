const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Prisma errors
  if (err.code === 'P2002') {
    return res.status(409).json({
      message: 'A unique constraint was violated',
      field: err.meta?.target?.[0]
    });
  }

  if (err.code === 'P2025') {
    return res.status(404).json({ message: 'Record not found' });
  }

  // Validation errors
  if (err.isJoi || err.status === 400) {
    return res.status(400).json({
      message: 'Validation error',
      details: err.details || err.message
    });
  }

  // Default error
  res.status(err.statusCode || 500).json({
    message: err.message || 'Internal server error'
  });
};

module.exports = { errorHandler };
