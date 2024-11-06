const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const orphanageSchema = new mongoose.Schema({
  orphanageName: {
    type: String,
    required: true,
  },
  regNumber: {
    type: String,
    required: true,
    unique: true,
  },
  orgType: {
    type: String,
    enum: ['non-profit', 'government', 'private'], // Ensures only allowed values
    required: true,
  },
  contactName: {
    type: String,
    required: true,
  },
  contactPosition: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    index: true, // Index for efficient querying
  },
  physicalAddress: {
    type: String,
    required: true,
  },
  contactDetails: {
    type: String,
    required: true,
  },
  numberOfChildren: {
    type: Number,
    required: true,
    min: 1, // Ensure positive number
  },
  password: {
    type: String,
    required: true,
    minlength: 8, // Match frontend validation requirement
  },
}, { timestamps: true });

// Pre-save hook to hash password if modified
orphanageSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Pre-validate hook to normalize email to lowercase
orphanageSchema.pre('validate', function (next) {
  if (this.email) {
    this.email = this.email.toLowerCase();
  }
  next();
});

// Method to compare passwords
orphanageSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Orphanage', orphanageSchema); // Updated model name
