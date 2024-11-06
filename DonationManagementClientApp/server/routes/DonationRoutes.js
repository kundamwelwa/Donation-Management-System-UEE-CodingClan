// routes/donationRoutes.js

const express = require('express');
const router = express.Router();
const DonationController = require('../controllers/DonationController');
const authenticateToken = require('../middlewares/authMiddlewares');
const authorizeDonation = require('../middlewares/AuthorizeDonation');
const { errorHandler } = require('../middlewares/errorHandler');
const { validateDonationCreation, validateDonationUpdate } = require('../middlewares/Campaign_DonationsValidation');

/**
 * Donation Routes
 */

// Get donation history for a donor
router.get('/getHistory', authenticateToken, DonationController.getDonationHistory);

// Create a new donation (Donor only)
router.post(
  '/create',
  authenticateToken,
  validateDonationCreation, // Validate input data
  DonationController.createDonation
);

// Update a donation (Donor only)
router.put(
  '/update/:id',
  authenticateToken,
  authorizeDonation, // Ensure the donor owns the donation
  validateDonationUpdate, 
  DonationController.updateDonation
);

// Delete a donation (Donor only)
router.delete(
  '/delete/:id',
  authenticateToken,
  authorizeDonation, // Ensure the donor owns the donation
  DonationController.deleteDonation
);

// Donation Routes
router.get('/getDonationHistory', authenticateToken, DonationController.getDonationHistory); // Get Donation History

// Error Handling Middleware
router.use(errorHandler);

module.exports = router;
