const express = require('express');
const router = express.Router();
const CampaignController = require('../controllers/CampaignController');
const authenticateToken = require('../middlewares/authMiddlewares');
const authorizeCampaign = require('../middlewares/AuthorizeCampaign');
const { errorHandler } = require('../middlewares/errorHandler');
const { validateCampaignCreation, validateCampaignUpdate } = require('../middlewares/Campaign_DonationsValidation');
const upload = require('../middlewares/upload'); // Import the multer setup for handling file uploads

/**
 * Campaign Routes
 */

// Create a new campaign (Orphanage only)
// Use the upload middleware to handle image upload
router.post('/create', authenticateToken, upload.single('image'), validateCampaignCreation, CampaignController.create);

// Get all ongoing (active) campaigns (Donors and Orphanages)
router.get('/ongoing', authenticateToken, CampaignController.getOngoingCampaigns);

// Get a specific campaign by ID (Donors and Orphanages)
// Uncomment this line if you want to enable fetching a specific campaign
// router.get('/:id', authenticateToken, CampaignController.getCampaignById);

// Update a campaign (Orphanage only)
// Use the upload middleware to handle image upload if needed for updates
router.put('/update/:id', authenticateToken, authorizeCampaign, upload.single('image'), validateCampaignUpdate, CampaignController.updateCampaign);

// Delete a campaign (Orphanage only)
router.delete('/delete/:id', authenticateToken, authorizeCampaign, CampaignController.deleteCampaign);

// Get all campaigns (Admin or Orphanage if applicable)
router.get('/all', authenticateToken, CampaignController.getAllCampaigns);

// Get donated campaigns for the logged-in user
router.get('/getDonatedCampaigns', authenticateToken, CampaignController.getDonatedCampaigns);

// Error Handling Middleware
router.use(errorHandler);

module.exports = router;
