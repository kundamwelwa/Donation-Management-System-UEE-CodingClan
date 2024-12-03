const express = require('express');
const router = express.Router();
const OrphanageAuthController = require('../controllers/OrphanageController'); // Import the controller
const { validateOrphanageSignup, validateOrphanageLogin } = require('../middlewares/OrphanageValidation');
const { errorHandler } = require('../middlewares/OrphanageMiddleware');
const authenticateToken = require('../middlewares/authenticateToken'); // General authentication

// Orphanage Sign Up
router.post('/orphanageSignup', validateOrphanageSignup, OrphanageAuthController.Orphanagesignup);

// Orphanage Login
router.post('/orphanageLogin', validateOrphanageLogin, OrphanageAuthController.Orphanagelogin);

// Get all orphanages (general fetch)
router.get('/getAllOrphanages', authenticateToken, OrphanageAuthController.getAllOrphanages);

// Get donated orphanages
router.get('/getDonatedOrphanages', authenticateToken, OrphanageAuthController.getDonatedOrphanages);

// Get orphanages available for a donor
router.get('/getOrphanagesForDonor', authenticateToken, OrphanageAuthController.getOrphanagesForDonor);

// Fetch orphanage details by ID
router.get('/getOrphanageById/:orphanageId', authenticateToken, OrphanageAuthController.getOrphanageById); 

// Fetch logged-in orphanage's data
router.get('/getOrphanage', authenticateToken, OrphanageAuthController.getOrphanage);

// Error Handling Middleware
router.use(errorHandler); // Ensure this is the last middleware

module.exports = router;
