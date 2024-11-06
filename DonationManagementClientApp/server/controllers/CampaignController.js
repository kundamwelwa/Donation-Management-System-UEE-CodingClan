const mongoose = require('mongoose');
const Campaign = require('../models/Campaigns');
const Donation = require('../models/Donations');
const multer = require('multer');

// Create a new campaign (Orphanage only)
exports.create = async (req, res) => {
  try {
    // Extract campaign details from the request body
    const { name, description, targetAmount, category, startDate, endDate, location } = req.body;

    // Check if all required fields are present
    if (!name || !description || !targetAmount || !category || !startDate || !endDate || !location) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if an image was uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'Image is required' });
    }

    // Handle the imageUri based on multer
    const imageUri = req.file.path; // Assuming multer saves the file and provides the path

    const newCampaign = new Campaign({
      name,
      description,
      targetAmount,
      currentAmount: 0, // Default to 0 when creating
      status: 'active', // Set default status
      category,
      startDate,
      endDate,
      location,
      imageUri,
      orphanage: req.user.id, // Assuming the orphanage ID is available in the token
    });

    // Save the campaign to the database
    const savedCampaign = await newCampaign.save();

    // Return only necessary details
    res.status(201).json({
      id: savedCampaign._id,
      name: savedCampaign.name,
      description: savedCampaign.description,
      targetAmount: savedCampaign.targetAmount,
      currentAmount: savedCampaign.currentAmount,
      category: savedCampaign.category,
      startDate: savedCampaign.startDate,
      endDate: savedCampaign.endDate,
      location: savedCampaign.location,
      status: savedCampaign.status,
      imageUri: savedCampaign.imageUri, // Include the imageUri in the response
    });
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
      .select('name description targetAmount currentAmount status orphanage category startDate endDate imageUri');

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
    const ongoingCampaigns = await Campaign.find({ status: 'active' })
      .populate('orphanage', 'orphanageName coverPhoto') // Populate orphanage details
      .select('name description targetAmount currentAmount status orphanage category startDate endDate imageUri');

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
      .populate('campaign', 'name description targetAmount currentAmount status orphanage category startDate endDate imageUri');

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
