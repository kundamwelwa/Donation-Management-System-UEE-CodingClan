const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define the user schema
const userSchema = new mongoose.Schema({
  userType: {
    type: String,
    enum: ['single', 'organization'],
    required: true,
  },
  fullName: {
    type: String,
    required: function () {
      return this.userType === 'single';
    },
  },
  orgName: {
    type: String,
    required: function () {
      return this.userType === 'organization';
    },
  },
  orgRegNumber: {
    type: String,
    required: function () {
      return this.userType === 'organization';
    },
  },
  orgType: {
    type: String,
    required: function () {
      return this.userType === 'organization';
    },
  },
  website: {
    type: String,
    default: '', // Consider using null if empty string is not a meaningful value
  },
  contactName: {
    type: String,
    required: function () {
      return this.userType === 'organization';
    },
  },
  contactPosition: {
    type: String,
    required: function () {
      return this.userType === 'organization';
    },
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensures email is unique
    index: true,  // Indexing for performance
  },
  physicalAddress: {
    type: String,
    required: true,
  },
  contactDetails: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6, // Enforce minimum password length
  },
}, { timestamps: true }); // Add timestamps

// Password hashing middleware
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); // Skip hashing if password is not modified

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err); // Pass error to the next middleware
  }
});

// Normalize email before validation
userSchema.pre('validate', function (next) {
  if (this.email) {
    this.email = this.email.toLowerCase();
  }
  next();
});

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Export the model
module.exports = mongoose.model('Donors', userSchema);
