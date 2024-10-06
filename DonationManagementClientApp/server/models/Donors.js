// models/Donors.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const donorSchema = new mongoose.Schema({
  userType: {
    type: String,
    enum: ['Personal', 'Organization'],
    required: true,
  },
  fullName: {
    type: String,
    required: function () {
      return this.userType === 'Personal';
    },
  },
  orgName: {
    type: String,
    required: function () {
      return this.userType === 'Organization';
    },
  },
  orgRegNumber: {
    type: String,
    required: function () {
      return this.userType === 'Organization';
    },
  },
  orgType: {
    type: String,
    required: function () {
      return this.userType === 'Organization';
    },
  },
  contactName: {
    type: String,
    required: function () {
      return this.userType === 'Organization';
    },
  },
  contactPosition: {
    type: String,
    required: function () {
      return this.userType === 'Organization';
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true, // Ensures emails are stored in lowercase
  },
  password: {
    type: String,
    required: true,
  },
  physicalAddress: {
    type: String,
    required: true,
  },
  contactDetails: {
    type: String,
    required: true,
  },
}, { timestamps: true });

// Pre-save hook to hash password before saving
donorSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Method to compare entered password with hashed password
donorSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Donors', donorSchema);
