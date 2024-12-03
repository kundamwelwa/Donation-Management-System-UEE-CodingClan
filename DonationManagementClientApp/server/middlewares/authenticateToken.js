const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extract Bearer token

  if (!token) {
    console.log('No token provided');
    return res.status(401).json({ message: 'Authorization denied, no token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
    if (error) {
      console.error('Token verification failed:', error);

      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token expired, please log in again' });
      }

      return res.status(403).json({ message: 'Invalid token, authorization denied' });
    }

    req.user = decoded; // Attach user information to the request object
    next();
  });
};

module.exports = authenticateToken;
