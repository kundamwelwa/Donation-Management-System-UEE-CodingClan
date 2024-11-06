
const errorHandler = (err, _req, res, _next) => {

    console.error('Error Details:', {
      message: err.message,
      stack: err.stack,
      status: err.status,
      name: err.name,
    });

    const statusCode = err.status || 500;
    const message = err.message || 'Internal Server Error';

    if (err.name === 'ValidationError') {
      res.status(400).json({
        message: 'Validation Error',
        details: err.errors, 
      });
    } else if (err.name === 'MongoError' && err.code === 11000) {
      res.status(400).json({
        message: 'Duplicate Key Error', 
      });
    } else if (err.name === 'JsonWebTokenError') {
      res.status(401).json({
        message: 'Invalid Token', 
      });
    } else if (err.name === 'OrphanageError') {
   
      res.status(statusCode).json({
        message: 'Orphanage Error',
        details: err.details || 'An error occurred related to orphanage operations.',
      });
    } else {
     
      res.status(statusCode).json({
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }), 
      });
    }
  };
  
  module.exports = { errorHandler };
  