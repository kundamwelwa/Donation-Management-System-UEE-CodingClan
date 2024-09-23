// routes/orphanageAuthRoutes.js

const express = require('express');
const router = express.Router();
const OrphanageAuthController = require('../controllers/OrphanageController'); // Ensure the path is correct
const { validateOrphanageSignup, validateOrphanageLogin } = require('../middlewares/OrphanageValidation');
const { errorHandler } = require('../middlewares/OrphanageErrorHundler'); // Corrected spelling
const authenticateOrphanageToken = require('../middlewares/authenticateOrphanageToken'); // Corrected import
const authenticateToken = require('../middlewares/authenticateToken'); // Newly added import

// Orphanage Signup Route
router.post(
  '/Orphanagesignup', 
  validateOrphanageSignup, 
  OrphanageAuthController.Orphanagesignup 
);

// Orphanage Login Route
router.post(
  '/Orphanagelogin',
  validateOrphanageLogin, 
  OrphanageAuthController.Orphanagelogin
);

// Get Orphanage Profile Route
router.get(
  '/getOrphanage', 
  authenticateOrphanageToken, 
  OrphanageAuthController.getOrphanage 
);

// Donor Dashboard Routes
// Orphanage Routes
router.get('/getAllOrphanages', authenticateToken, OrphanageAuthController.getAllOrphanages); // Get All Orphanages
router.get('/getDonatedOrphanages', authenticateToken, OrphanageAuthController.getDonatedOrphanages); // Get Donated Orphanages
router.get('/getOrphanagesForDonor', authenticateToken, OrphanageAuthController.getOrphanagesForDonor); // Get Orphanages Associated with Donor

// Error Handling Middleware
router.use(errorHandler);

module.exports = router;
