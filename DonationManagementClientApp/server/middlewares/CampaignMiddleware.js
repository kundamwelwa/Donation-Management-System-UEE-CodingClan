// middlewares/authorizeCampaign.js

const Campaign = require('../models/Campaigns');
const Orphanage = require('../models/Orphanages');
const mongoose = require('mongoose');

/**
 * Middleware to authorize that the authenticated orphanage owns the campaign.
 */
const authorizeCampaign = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const campaignId = req.params.id;

    // Validate campaign ID
    if (!mongoose.Types.ObjectId.isValid(campaignId)) {
      return res.status(400).json({ message: 'Invalid campaign ID.' });
    }

    // Fetch the orphanage associated with the user
    const orphanage = await Orphanage.findOne({ user: userId });

    if (!orphanage) {
      return res.status(404).json({ message: 'Orphanage not found for this user.' });
    }

    // Check if the campaign belongs to the orphanage
    const campaign = await Campaign.findOne({ _id: campaignId, orphanage: orphanage._id });

    if (!campaign) {
      return res.status(403).json({ message: 'You are not authorized to modify this campaign.' });
    }

    // Attach campaign to request object for further use if needed
    req.campaign = campaign;

    next();
  } catch (error) {
    console.error('Authorization Error:', error);
    res.status(500).json({ message: 'Server error during authorization.', error: error.message });
  }
};

module.exports = authorizeCampaign;
