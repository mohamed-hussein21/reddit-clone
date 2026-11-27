export const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      message: 'Image must be under 2MB'
    });
  }

  if (err.code === 11000) {
    return res.status(409).json({
      message: 'Duplicate value',
      fields: err.keyValue
    });
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: err.message
    });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({
      message: 'Invalid id'
    });
  }

  const status = err.statusCode || err.status || 500;

  res.status(status).json({
    message: err.message || 'Server error'
  });
};