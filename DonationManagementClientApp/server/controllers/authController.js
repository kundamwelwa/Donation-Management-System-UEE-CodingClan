const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Helper function to generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

// Signup Functionality
exports.signup = async (req, res) => {
  const {
    email,
    password,
    fullName,
    orgName,
    userType,
    orgRegNumber,
    orgType,
    website,
    contactName,
    contactPosition,
    physicalAddress,
    contactDetails,
  } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already registered' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user instance
    const user = new User({
      email,
      password: hashedPassword, // Store the hashed password
      userType,
      fullName: userType === 'single' ? fullName : null,
      orgName: userType === 'organization' ? orgName : null,
      orgRegNumber: userType === 'organization' ? orgRegNumber : null,
      orgType: userType === 'organization' ? orgType : null,
      website: userType === 'organization' ? website : null,
      contactName: userType === 'organization' ? contactName : null,
      contactPosition: userType === 'organization' ? contactPosition : null,
      physicalAddress,
      contactDetails: userType === 'organization' ? contactDetails : null,
    });

    // Save the user to the database
    await user.save();

    // Generate JWT token
    const token = generateToken(user._id);

    // Send response
    res.status(201).json({ message: 'User registered successfully', token, user });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Login Functionality
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Check if password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = generateToken(user._id);

    // Send response
    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.userType === 'single' ? user.fullName : user.orgName,
        userType: user.userType,
      },
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Fetch User Functionality (User profile)
exports.getUser = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch the user from the database by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      name: user.userType === 'single' ? user.fullName : user.orgName,
      email: user.email,
      // Include other user data if needed
    });
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
