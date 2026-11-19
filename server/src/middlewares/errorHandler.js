// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
  if (err.code === 11000) return res.status(409).json({ message: 'Duplicate value', fields: err.keyValue });
  if (err.name === 'ValidationError') return res.status(400).json({ message: err.message });
  if (err.name === 'CastError') return res.status(400).json({ message: 'Invalid id' });
  const status = err.statusCode || 500;
  res.status(status).json({ message: err.message || 'Server error' });
};
