// middlewares/authorizeDonation.js

const Donation = require('../models/Donations'); // Adjust the path as necessary

// Middleware to authorize user access to a specific donation
const authorizeDonation = async (req, res, next) => {
  try {
    const donationId = req.params.id; // Assuming donation ID is in the route parameter 'id'

    // Fetch the donation from the database
    const donation = await Donation.findById(donationId);

    if (!donation) {
      return res.status(404).json({ message: 'Donation not found.' });
    }

    // Check if the authenticated user is the owner of the donation
    if (donation.donor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You are not authorized to access this donation.' });
    }

    // Attach the donation to the request object for further use if needed
    req.donation = donation;

    next(); // User is authorized, proceed to the next middleware or route handler
  } catch (error) {
    console.error('Authorization Error:', error);
    res.status(500).json({ message: 'Server error during authorization.', error: error.message });
  }
};

module.exports = authorizeDonation;
