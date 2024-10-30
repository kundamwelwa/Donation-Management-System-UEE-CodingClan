const authenticateOrphanageToken = (req, res, next) => {
  const authHeader = req.headers['authorization']; // Use lowercase 'authorization'
  const token = authHeader && authHeader.split(' ')[1];

  console.log('Headers:', req.headers); // Log all headers for debugging

  if (!token) {
    console.log('No token provided');
    return res.status(401).json({ message: 'Authorization denied, no token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.orphanage = decoded;
    next();
  } catch (error) {
    console.error('Token verification failed:', error);
    res.status(401).json({ message: 'Invalid token, authorization denied' });
  }
};
