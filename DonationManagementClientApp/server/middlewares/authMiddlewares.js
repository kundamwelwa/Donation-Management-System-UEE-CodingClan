const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {

  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    console.log('No token provided');
    return res.status(401).json({ message: 'Authorization denied, no token provided' });
  }

  try {
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    req.user = decoded;
    
    next();
  } catch (error) {
    
    console.error('Token verification failed:', error); // Log for debugging
    res.status(401).json({ message: 'Invalid token, authorization denied' });
  }
};

module.exports = authenticateToken;
