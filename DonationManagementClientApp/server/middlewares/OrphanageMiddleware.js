
const errorHandler = (err, _req, res, _next) => {
  console.error('Error:', err.stack); 

  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'production' ? {} : err.stack 
  });
};

module.exports = { errorHandler };
