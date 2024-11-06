// controllers/authController.js

const User = require('../models/Donors');
const jwt = require('jsonwebtoken');
require('express-validator');

const generateToken = (userId) => {
  const secret = process.env.JWT_SECRET || 'default_secret';
  return jwt.sign({ id: userId }, secret, { expiresIn: '1d' });
};

// Signup function
exports.signup = async (req, res) => {
  const {
    email,
    password,
    fullName,
    orgName,
    userType,
    orgRegNumber,
    orgType,
    contactName,
    contactPosition,
    physicalAddress,
    contactDetails,
  } = req.body;

  try {
    // Validate required fields
    if (!email || !password || !userType) {
      return res.status(400).json({ message: 'Email, password, and user type are required.' });
    }

    // Normalize email
    const normalizedEmail = email.toLowerCase();

    // Check if user already exists
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      console.log(`Signup Error: User with email ${normalizedEmail} already exists.`);
      return res.status(400).json({ message: 'User already registered' });
    }

    // Prepare user data based on userType
    const userData = {
      email: normalizedEmail,
      password, // Plain password; will be hashed automatically
      userType,
      physicalAddress,
      contactDetails,
    };

    if (userType === 'Personal') {
      if (!fullName) {
        return res.status(400).json({ message: 'Full name is required for personal users.' });
      }
      userData.fullName = fullName;
    } else if (userType === 'Organization') {
      if (!orgName || !orgRegNumber || !orgType || !contactName || !contactPosition) {
        return res.status(400).json({ message: 'All organization fields are required.' });
      }
      userData.orgName = orgName;
      userData.orgRegNumber = orgRegNumber;
      userData.orgType = orgType;
      userData.contactName = contactName;
      userData.contactPosition = contactPosition;
    } else {
      return res.status(400).json({ message: 'Invalid user type.' });
    }

    // Create new user
    const user = new User(userData);

    // Save user to database (password hashing occurs here)
    await user.save();
    console.log(`User ${normalizedEmail} registered successfully.`);

    // Generate JWT token
    const token = generateToken(user._id);
    console.log(`JWT Token generated for user ${user.email}: ${token}`);

    res.status(201).json({ message: 'User registered successfully', token });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Login function
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if email and password are provided
    if (!email || !password) {
      console.log('Login Error: Email and password are required.');
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const normalizedEmail = email.toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    // Check if user exists
    if (!user) {
      console.log(`Login Error: No user found with email ${normalizedEmail}.`);
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Compare passwords
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log(`Login Error: Password mismatch for user ${normalizedEmail}.`);
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = generateToken(user._id);
    console.log(`JWT Token generated for user ${user.email}: ${token}`);

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.userType === 'Personal' ? user.fullName : user.orgName,
        userType: user.userType,
      },
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get user profile function
exports.getUser = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch user by ID
    const user = await User.findById(userId);

    if (!user) {
      console.log(`GetUser Error: No user found with ID ${userId}.`);
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      name: user.userType === 'Personal' ? user.fullName : user.orgName,
      email: user.email,
    });
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
