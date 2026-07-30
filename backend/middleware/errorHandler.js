const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    data: process.env.NODE_ENV === 'development' ? err.stack : null
  });
};

module.exports = errorHandler;
