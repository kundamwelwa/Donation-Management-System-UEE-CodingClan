const express = require('express');
const router = express.Router();
const OrphanageAuthController = require('../controllers/OrphanageController');
const { validateOrphanageSignup, validateOrphanageLogin } = require('../middlewares/OrphanageValidation');
const { errorHandler } = require('../middlewares/OrphanageMiddleware');
const authenticateOrphanageToken = require('../middlewares/authenticateOrphanageToken');
const authenticateToken = require('../middlewares/authenticateToken');

// Orphanage Signup Route
router.post('/orphanageSignup', validateOrphanageSignup, OrphanageAuthController.Orphanagesignup);

// Orphanage Login Route
router.post('/orphanageLogin', validateOrphanageLogin, OrphanageAuthController.Orphanagelogin);

// Get Orphanage Profile Route
router.get('/getOrphanage', authenticateOrphanageToken, OrphanageAuthController.getOrphanage);

// Donor Dashboard Routes
router.get('/getAllOrphanages', authenticateToken, OrphanageAuthController.getAllOrphanages);
router.get('/getDonatedOrphanages', authenticateToken, OrphanageAuthController.getDonatedOrphanages);
router.get('/getOrphanagesForDonor', authenticateToken, OrphanageAuthController.getOrphanagesForDonor);

// Get Specific Orphanage by ID
router.get('/orphanages/:id', authenticateToken, OrphanageAuthController.getOrphanageById);

// Error Handling Middleware
router.use(errorHandler); // Error handler middleware should be last

module.exports = router;
