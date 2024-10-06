const mongoose = require('mongoose');
const Campaign = require('../models/Campaigns');
const Donation = require('../models/Donations');

// Create a new campaign (Orphanage only)
exports.createCampaign = async (req, res) => {
  try {
    const { name, description, goal } = req.body;

    const newCampaign = new Campaign({
      name,
      description,
      goal,
      status: 'ongoing', // Set default status
      orphanage: req.user.id, // Assuming the orphanage ID is available in the token
    });

    const savedCampaign = await newCampaign.save();
    res.status(201).json(savedCampaign);
  } catch (error) {
    console.error('Error creating campaign:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all campaigns
exports.getAllCampaigns = async (_req, res) => {
  try {
    const campaigns = await Campaign.find()
      .populate('orphanage', 'orphanageName coverPhoto') // Populate orphanage details
      .select('name description goal status orphanage');

    if (campaigns.length === 0) {
      return res.status(200).json({ message: 'No campaigns available yet.' });
    }

    res.json(campaigns);
  } catch (error) {
    console.error('Error fetching all campaigns:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all ongoing campaigns (for Donors and Orphanages)
exports.getOngoingCampaigns = async (_req, res) => {
  try {
    const ongoingCampaigns = await Campaign.find({ status: 'ongoing' })
      .populate('orphanage', 'orphanageName coverPhoto') // Populate orphanage details
      .select('name description goal status orphanage');

    if (ongoingCampaigns.length === 0) {
      return res.status(200).json({ message: 'No ongoing campaigns available.' });
    }

    res.json(ongoingCampaigns);
  } catch (error) {
    console.error('Error fetching ongoing campaigns:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update a campaign (Orphanage only)
exports.updateCampaign = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate if the id is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid campaign ID' });
    }

    const updates = req.body;
    const updatedCampaign = await Campaign.findByIdAndUpdate(id, updates, { new: true });

    if (!updatedCampaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    res.json(updatedCampaign);
  } catch (error) {
    console.error('Error updating campaign:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete a campaign (Orphanage only)
exports.deleteCampaign = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate if the id is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid campaign ID' });
    }

    const deletedCampaign = await Campaign.findByIdAndDelete(id);

    if (!deletedCampaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    res.status(204).send(); // No content
  } catch (error) {
    console.error('Error deleting campaign:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get donated campaigns
exports.getDonatedCampaigns = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch donations made by the donor and populate the campaign
    const donations = await Donation.find({ donor: userId })
      .populate('campaign', 'name description goal status orphanage coverPhoto');

    if (donations.length === 0) {
      return res.status(200).json({ message: 'You have not donated to any campaigns yet.' });
    }

    // Extract unique campaigns from the donations
    const donatedCampaignsMap = {};
    donations.forEach(donation => {
      if (donation.campaign) {
        donatedCampaignsMap[donation.campaign._id] = donation.campaign;
      }
    });

    const donatedCampaigns = Object.values(donatedCampaignsMap);

    if (donatedCampaigns.length === 0) {
      return res.status(200).json({ message: 'No campaigns found for your donations.' });
    }

    res.json(donatedCampaigns);
  } catch (error) {
    console.error('Error fetching donated campaigns:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

