const Orphanage = require('../models/Orphanages');
const Donation = require('../models/ProjectListing');
const projects = require('../models/ProjectListing'); // Ensure this is the correct import path
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');


// Function to generate JWT token for orphanages
const generateOrphanageToken = (orphanageId) => {
  const secret = process.env.JWT_SECRET || 'default_secret'; // Replace with your actual secret
  return jwt.sign({ id: orphanageId }, secret, { expiresIn: '1d' });
};

// Helper function to validate ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Orphanage Signup
exports.Orphanagesignup = async (req, res) => {
  const {
    orphanageName,
    regNumber,
    orgType,
    contactName,
    contactPosition,
    email,
    physicalAddress,
    contactDetails,
    numberOfChildren,
    password,
    coverPhoto,
  } = req.body;

  try {
    // Check if orphanage already exists
    const existingOrphanage = await Orphanage.findOne({ email: email.toLowerCase() });
    if (existingOrphanage) {
      return res.status(400).json({ message: 'Orphanage already registered with this email.' });
    }

    // Create new orphanage
    const newOrphanage = new Orphanage({
      orphanageName,
      regNumber,
      orgType,
      contactName,
      contactPosition,
      email: email.toLowerCase(),
      physicalAddress,
      contactDetails,
      numberOfChildren,
      password, // Password will be hashed via pre-save hook in the model
      coverPhoto,
      donors: [], // Initialize donors array
    });

    // Save to database (password hashing occurs here)
    await newOrphanage.save();

    // Generate JWT token
    const token = generateOrphanageToken(newOrphanage._id);

    res.status(201).json({ message: 'Orphanage registered successfully', token });
  } catch (error) {
    console.error('Error during orphanage signup:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Orphanage Login
exports.Orphanagelogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log('Orphanagelogin endpoint hit');

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const normalizedEmail = email.toLowerCase();
    const orphanage = await Orphanage.findOne({ email: normalizedEmail });
    
    if (!orphanage) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    const isMatch = await orphanage.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    const token = generateOrphanageToken(orphanage._id);
    
    // Include orphanage ID in the response
    res.status(200).json({
      message: 'Login successful',
      token,
      name: orphanage.orphanageName,
      id: orphanage._id // Include orphanage ID in the response
    });
  } catch (error) {
    console.error('Error during orphanage login:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getOrphanageById = async (req, res) => {
  try {
    const { orphanageId } = req.params; // Extract orphanageId from the request parameters
    console.log('Orphanage ID:', orphanageId); // Debug log to check ID format

    // Validate if orphanageId is a valid ObjectId  
    if (!orphanageId || !mongoose.Types.ObjectId.isValid(orphanageId)) {
      console.error('Invalid Orphanage ID:', orphanageId); // Log invalid IDs
      return res.status(400).json({ message: 'Invalid orphanage ID format' });
    }

    // Fetch orphanage and populate its projects
    const orphanage = await Orphanage.findById(orphanageId).populate('projects'); // Populate 'projects'

    // Handle case where orphanage is not found
    if (!orphanage) {
      console.error(`Orphanage not found for ID: ${orphanageId}`);
      return res.status(404).json({ message: 'Orphanage not found' });
    }

    // Format orphanage details
    const orphanageDetails = {
      id: orphanage._id,
      name: orphanage.orphanageName,
      physicalAddress: orphanage.physicalAddress,
      numberOfChildren: orphanage.numberOfChildren,
      contactDetails: orphanage.contactDetails,
    };

    // Format associated projects
    const projects = orphanage.projects.map((project) => ({
      id: project._id,
      projectName: project.projectName,
      description: project.description,
      imageUri: project.imageUri,
      startDate: project.startDate,
      endDate: project.endDate,
      progress: project.progress,
      status: project.status,
      projectedAmount: project.projectedAmount,
      currentAmount: project.currentAmount,
      location: project.location,
      category: project.category,
      projectType: project.projectType,
    }));

    // Respond with the orphanage details and associated projects
    return res.status(200).json({
      orphanage: orphanageDetails,
      projects,
    });
  } catch (error) {
    console.error('Error fetching orphanage details:', error);
    return res.status(500).json({ message: 'Failed to fetch orphanage details', error: error.message });
  }
};


exports.getOrphanage = async (req, res) => {
  try {
    const orphanageId = req.user.id; // Get the orphanage ID from the decoded token

    // Check if orphanage ID is valid
    if (!orphanageId || !isValidObjectId(orphanageId)) {
      return res.status(400).json({ message: 'Invalid orphanage ID format' });
    }

    // Fetch orphanage without populating projects
    const orphanage = await Orphanage.findById(orphanageId);

    if (!orphanage) {
      console.log(`GetOrphanage Error: No orphanage found with ID ${orphanageId}.`);
      return res.status(404).json({ message: 'Orphanage not found' });
    }

    const orphanageDetails = {
      name: orphanage.orphanageName,
      physicalAddress: orphanage.physicalAddress,
      numberOfChildren: orphanage.numberOfChildren,     
    };

    // Return the orphanage details
    res.status(200).json({
      orphanage: orphanageDetails,
    });

  } catch (error) {
    console.error('Error fetching orphanage details:', error);
    res.status(500).json({ message: 'Failed to fetch orphanage details', error: error.message });
  }
};


// Get All Orphanages
exports.getAllOrphanages = async (_req, res) => {
  try {
    console.log('getAllOrphanages endpoint hit');

    const orphanages = await Orphanage.find().select('orphanageName physicalAddress numberOfChildren');

    if (orphanages.length === 0) {
      return res.status(200).json({ message: 'No orphanages registered yet.' });
    }

    res.status(200).json(orphanages);
  } catch (error) {
    console.error('Error fetching all orphanages:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get Donated Orphanages
exports.getDonatedOrphanages = async (req, res) => {
  try {
    console.log('getDonatedOrphanages endpoint hit');

    const userId = req.user.id;

    const donations = await Donation.find({ donor: userId })
      .populate({
        path: 'campaign',
        populate: { path: 'orphanage', select: 'orphanageName coverPhoto' },
      });

    if (donations.length === 0) {
      return res.status(200).json({ message: 'You have not donated to any orphanages yet.' });
    }

    const donatedOrphanagesMap = {};
    donations.forEach(donation => {
      if (donation.campaign && donation.campaign.orphanage) {
        donatedOrphanagesMap[donation.campaign.orphanage._id] = donation.campaign.orphanage;
      }
    });

    const donatedOrphanages = Object.values(donatedOrphanagesMap);

    res.status(200).json(donatedOrphanages);
  } catch (error) {
    console.error('Error fetching donated orphanages:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get Orphanages Associated with the Donor
exports.getOrphanagesForDonor = async (req, res) => {
  try {
    console.log('getOrphanagesForDonor endpoint hit');

    const userId = req.user.id;

    const orphanages = await Orphanage.find({ donors: userId });

    if (orphanages.length === 0) {
      return res.status(200).json({ message: 'No orphanages found for this donor' });
    }

    res.status(200).json(orphanages);
  } catch (error) {
    console.error('Error fetching orphanages:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
