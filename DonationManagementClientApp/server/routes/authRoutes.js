const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateSignup, validateLogin } = require('../middlewares/validation');
const { errorHandler } = require('../middlewares/errorHandler');
const authenticateToken = require('../middlewares/authMiddlewares'); // Import the middleware

// Signup Route
// Route to handle user signup
router.post('/signup', validateSignup, authController.signup);

// Login Route
// Route to handle user login
router.post('/login', validateLogin, authController.login);

// User Route
// Route to get user information, protected by authenticateToken middleware
router.get('/User', authenticateToken, authController.getUser);

// Optionally, you can add more routes here...

// Error handling middleware (optional if you have it globally)
// If you're using a global error handler, you can remove this line
router.use(errorHandler);

module.exports = router;
