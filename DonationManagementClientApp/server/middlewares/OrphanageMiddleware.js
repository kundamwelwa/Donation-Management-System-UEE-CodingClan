// middlewares/authorizeDonation.js

const Donation = require('../models/Donations');
const mongoose = require('mongoose');

/**
 * Middleware to authorize that the authenticated donor owns the donation.
 */
const authorizeDonation = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const donationId = req.params.id;

    // Validate donation ID
    if (!mongoose.Types.ObjectId.isValid(donationId)) {
      return res.status(400).json({ message: 'Invalid donation ID.' });
    }

    // Find the donation and ensure it belongs to the authenticated donor
    const donation = await Donation.findOne({ _id: donationId, donor: userId });

    if (!donation) {
      return res.status(403).json({ message: 'You are not authorized to modify this donation.' });
    }

    // Attach donation to request object for further use if needed
    req.donation = donation;

    next();
  } catch (error) {
    console.error('Authorization Error:', error);
    res.status(500).json({ message: 'Server error during authorization.', error: error.message });
  }
};

module.exports = authorizeDonation;
