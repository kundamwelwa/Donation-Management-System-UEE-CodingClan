const express = require('express');
const router = express.Router();
const CampaignController = require('../controllers/CampaignController');
const authenticateToken = require('../middlewares/authMiddlewares');
const authorizeCampaign = require('../middlewares/AuthorizeCampaign');
const { errorHandler } = require('../middlewares/errorHandler');
const { validateCampaignCreation, validateCampaignUpdate } = require('../middlewares/Campaign_DonationsValidation');

/**
 * Campaign Routes
 */

// Create a new campaign (Orphanage only)
router.post('/create', authenticateToken, validateCampaignCreation, CampaignController.createCampaign);

// Get all ongoing (active) campaigns (Donors and Orphanages)
router.get('/ongoing', authenticateToken, CampaignController.getOngoingCampaigns);

// Get a specific campaign by ID (Donors and Orphanages)
//router.get('/:id', authenticateToken, CampaignController.getCampaignById);

// Update a campaign (Orphanage only)
router.put('/update/:id', authenticateToken, authorizeCampaign, validateCampaignUpdate, CampaignController.updateCampaign);

// Delete a campaign (Orphanage only)
router.delete('/delete/:id', authenticateToken, authorizeCampaign, CampaignController.deleteCampaign);

// Get all campaigns (Admin or Orphanage if applicable)
router.get('/all', authenticateToken, CampaignController.getAllCampaigns);

// Get donated campaigns for the logged-in user
router.get('/getDonatedCampaigns', authenticateToken, CampaignController.getDonatedCampaigns);

// Error Handling Middleware
router.use(errorHandler);

module.exports = router;
