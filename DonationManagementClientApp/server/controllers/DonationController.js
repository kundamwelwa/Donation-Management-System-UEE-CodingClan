// controllers/donationController.js

const Donation = require('../models/Donations');
const Campaign = require('../models/Campaigns');

/**
 * Fetch Donation History for a Donor
 */
exports.getDonationHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch donation history for the user, populate campaign and orphanage details
    const donations = await Donation.find({ donor: userId })
      .populate({
        path: 'campaign',
        populate: { path: 'orphanage', select: 'name coverPhoto' },
      })
      .sort({ createdAt: -1 });

    if (donations.length === 0) {
      return res.status(200).json({ message: 'No donation data available.' });
    }

    res.json(donations);
  } catch (error) {
    console.error('Error fetching donation history:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Create a New Donation (Donor only)
 */
exports.createDonation = async (req, res) => {
  try {
    const userId = req.user.id;
    const { campaignId, amount, paymentMethod } = req.body;

    // Check if the campaign exists and is active
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found.' });
    }

    if (campaign.status !== 'active') {
      return res.status(400).json({ message: 'Cannot donate to a non-active campaign.' });
    }

    // Create a new donation
    const donation = new Donation({
      donor: userId,
      campaign: campaignId,
      amount,
      paymentMethod,
      status: 'completed', // Or 'pending' based on your payment flow
    });

    await donation.save();

    res.status(201).json({ message: 'Donation successful.', donation });
  } catch (error) {
    console.error('Error creating donation:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Update a Donation (Donor only)
 */
exports.updateDonation = async (req, res) => {
  try {
    const donation = req.donation; // Authorized donation from middleware
    const { status } = req.body;

    // Update status if provided
    if (status && ['pending', 'completed', 'refunded', 'canceled'].includes(status)) {
      donation.status = status;
    }

    await donation.save();

    res.json({ message: 'Donation updated successfully.', donation });
  } catch (error) {
    console.error('Error updating donation:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Delete a Donation (Donor only)
 */
exports.deleteDonation = async (req, res) => {
  try {
    const donation = req.donation; // Authorized donation from middleware

    await donation.remove();

    res.json({ message: 'Donation deleted successfully.' });
  } catch (error) {
    console.error('Error deleting donation:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
