const express = require('express');
const router = express.Router();
const OrphanageAuthController = require('../controllers/OrphanageController');
const { validateOrphanageSignup, validateOrphanageLogin } = require('../middlewares/OrphanageValidation');
const { errorHandler } = require('../middlewares/OrphanageMiddleware');
const authenticateToken = require('../middlewares/authenticateToken'); // General authentication

// Orphanage Signup Route
router.post('/orphanageSignup', validateOrphanageSignup, OrphanageAuthController.Orphanagesignup);

// Orphanage Login Route
router.post('/orphanageLogin', validateOrphanageLogin, OrphanageAuthController.Orphanagelogin);

// Get Orphanage Profile by ID Route
router.get('/getOrphanage', authenticateToken, OrphanageAuthController.getOrphanage);

// Donor Dashboard Routes
router.get('/getAllOrphanages', authenticateToken, OrphanageAuthController.getAllOrphanages);
router.get('/getDonatedOrphanages', authenticateToken, OrphanageAuthController.getDonatedOrphanages);
router.get('/getOrphanagesForDonor', authenticateToken, OrphanageAuthController.getOrphanagesForDonor);

// Error Handling Middleware
router.use(errorHandler); // Error handler middleware should be last

module.exports = router;
