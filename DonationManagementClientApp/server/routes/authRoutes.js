// routes/authRoutes.js

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateSignup, validateLogin } = require('../middlewares/validation');
const { errorHandler } = require('../middlewares/errorHandler');
const authenticateToken = require('../middlewares/authMiddlewares');

// User Authentication Routes
router.post('/signup', validateSignup, authController.signup);
router.post('/login', validateLogin, authController.login);
router.get('/getUser', authenticateToken, authController.getUser);


// Error Handling Middleware
router.use(errorHandler);

module.exports = router;
