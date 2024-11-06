const Campaign = require('../models/Campaigns'); // Adjust the path as necessary

// Middleware to authorize user access to a specific campaign
const authorizeCampaign = async (req, res, next) => {
  try {
    const campaignId = req.params.id; // Assuming campaign ID is in the route parameter 'id'

    // Fetch the campaign from the database
    const campaign = await Campaign.findById(campaignId);

    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found.' });
    }

    // Check if the authenticated orphanage user is the owner of the campaign
    if (campaign.orphanage.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You are not authorized to access this campaign.' });
    }

    // Attach the campaign to the request object for further use if needed
    req.campaign = campaign;

    next(); // User is authorized, proceed to the next middleware or route handler
  } catch (error) {
    console.error('Authorization Error:', error);
    res.status(500).json({ message: 'Server error during authorization.', error: error.message });
  }
};

module.exports = authorizeCampaign;
