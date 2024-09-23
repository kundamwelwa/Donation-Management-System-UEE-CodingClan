// models/Campaigns.js

const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    targetAmount: {
      type: Number,
      required: true,
      min: [1, 'Target amount must be at least $1'],
    },
    currentAmount: {
      type: Number,
      default: 0,
      min: [0, 'Current amount cannot be negative'],
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'failed'],
      default: 'active',
    },
    orphanage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Orphanage', // Reference to the Orphanage model
      required: true,
    },
    // Add other fields as necessary
  },
  { timestamps: true }
);

// Middleware to update the status based on currentAmount
campaignSchema.pre('save', function (next) {
  if (this.currentAmount >= this.targetAmount && this.status === 'active') {
    this.status = 'completed';
  }
  next();
});

const Campaign = mongoose.model('Campaigns', campaignSchema);

module.exports = Campaign;
