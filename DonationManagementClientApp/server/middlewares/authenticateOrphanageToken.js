const jwt = require('jsonwebtoken');

// Middleware to authenticate JWT token for orphanages
const authenticateOrphanageToken = (req, res, next) => {
  // Retrieve the token from the Authorization header (Bearer <token>)
  const authHeader = req.headers['Authorization']; // Note: Use headers for consistency with typical header names
  const token = authHeader && authHeader.split(' ')[1]; // Extract token from "Bearer <token>"

  if (!token) {
    console.log('No token provided'); // Log for debugging
    return res.status(401).json({ message: 'Authorization denied, no token provided' });
  }

  try {
    // Verify the token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach the orphanage information (decoded token) to the request object
    req.orphanage = decoded;
    
    // Move to the next middleware or route handler
    next();
  } catch (error) {
    // Token verification failed
    console.error('Token verification failed:', error); // Log for debugging
    res.status(401).json({ message: 'Invalid token, authorization denied' });
  }
};

module.exports = authenticateOrphanageToken;
