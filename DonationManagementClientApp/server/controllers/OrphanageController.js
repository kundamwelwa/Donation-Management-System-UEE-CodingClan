const Orphanage = require('../models/Orphanages');
const Donation = require('../models/Donations');
const jwt = require('jsonwebtoken');

// Function to generate JWT token for orphanages
const generateOrphanageToken = (orphanageId) => {
  const secret = process.env.JWT_SECRET || 'default_secret'; // Replace with your actual secret
  return jwt.sign({ id: orphanageId }, secret, { expiresIn: '1d' });
};

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
    // Find orphanage by email
    const orphanage = await Orphanage.findOne({ email: email.toLowerCase() });
    if (!orphanage) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    // Compare passwords using the model's method
    const isMatch = await orphanage.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    // Generate JWT token
    const token = generateOrphanageToken(orphanage._id);

    res.json({
      token,
      orphanage: {
        id: orphanage._id,
        email: orphanage.email,
        name: orphanage.orphanageName,
        regNumber: orphanage.regNumber,
        orgType: orphanage.orgType,
        contactName: orphanage.contactName,
        contactPosition: orphanage.contactPosition,
        physicalAddress: orphanage.physicalAddress,
        contactDetails: orphanage.contactDetails,
        numberOfChildren: orphanage.numberOfChildren,
        coverPhoto: orphanage.coverPhoto, // Include coverPhoto in the response
      },
    });
  } catch (error) {
    console.error('Error during orphanage login:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get Orphanage Profile
exports.getOrphanage = async (req, res) => {
  try {
    const orphanageId = req.orphanage.id; // Assuming middleware attaches orphanage info to req

    // Fetch orphanage by ID
    const orphanage = await Orphanage.findById(orphanageId).select('-password'); // Exclude password

    if (!orphanage) {
      return res.status(404).json({ message: 'Orphanage not found.' });
    }

    res.json(orphanage);
  } catch (error) {
    console.error('Error fetching orphanage profile:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get All Orphanages
exports.getAllOrphanages = async (req, res) => {
  try {
    const orphanages = await Orphanage.find().select('orphanageName coverPhoto physicalAddress numberOfChildren'); // Ensure fields are included

    if (orphanages.length === 0) {
      return res.status(200).json({ message: 'No orphanages registered yet.' });
    }

    res.json(orphanages);
  } catch (error) {
    console.error('Error fetching all orphanages:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get Donated Orphanages
exports.getDonatedOrphanages = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch donations made by the donor and populate the campaign's orphanage
    const donations = await Donation.find({ donor: userId })
      .populate({
        path: 'campaign',
        populate: { path: 'orphanage', select: 'orphanageName coverPhoto' },
      });

    if (donations.length === 0) {
      return res.status(200).json({ message: 'You have not donated to any orphanages yet.' });
    }

    // Extract orphanages from the donations
    const donatedOrphanagesMap = {};
    donations.forEach(donation => {
      if (donation.campaign && donation.campaign.orphanage) {
        donatedOrphanagesMap[donation.campaign.orphanage._id] = donation.campaign.orphanage;
      }
    });

    const donatedOrphanages = Object.values(donatedOrphanagesMap);

    if (donatedOrphanages.length === 0) {
      return res.status(200).json({ message: 'No orphanages found for your donations.' });
    }

    res.json(donatedOrphanages);
  } catch (error) {
    console.error('Error fetching donated orphanages:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get Orphanage By ID
exports.getOrphanageById = async (req, res) => {
  try {
    const orphanageId = req.params.id;
    const orphanage = await Orphanage.findById(orphanageId); // Fetch by ID
    if (!orphanage) {
      return res.status(404).json({ message: 'Orphanage not found' });
    }
    res.status(200).json(orphanage);
  } catch (error) {
    console.error('Error fetching orphanage by ID:', error);
    res.status(500).json({ message: 'Failed to fetch orphanage details', error });
  }
};


// Get Orphanages Associated with the Donor
exports.getOrphanagesForDonor = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch orphanages related to the donor
    const orphanages = await Orphanage.find({ donors: userId }); // Assuming 'donors' is an array of donor IDs

    if (orphanages.length === 0) {
      return res.status(200).json({ message: 'No orphanages found for this donor' });
    }

    res.json(orphanages);
  } catch (error) {
    console.error('Error fetching orphanages:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
