// Error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error(err.stack); // Log error stack to console
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }), // Include stack trace in development mode
  });
};

module.exports = { errorHandler };
