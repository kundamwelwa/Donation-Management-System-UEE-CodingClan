const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Campaign name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Campaign description is required'],
      trim: true,
    },
    targetAmount: {
      type: Number,
      required: [true, 'Target amount is required'],
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
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    imageUri: {
      type: String,
      required: [true, 'Image URI is required'],
    },
    orphanage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Orphanages', // Reference to the Orphanage model
      required: true,
    },
  },
  { timestamps: true }
);

// Middleware to update the status based on currentAmount
campaignSchema.pre('save', function (next) {
  if (this.currentAmount >= this.targetAmount && this.status === 'active') {
    this.status = 'completed';
  } else if (this.endDate < Date.now() && this.status === 'active') {
    this.status = 'failed'; // Automatically set to 'failed' if the end date has passed
  }
  next();
});

// Optional: Add a method to update currentAmount
campaignSchema.methods.updateCurrentAmount = function(amount) {
  this.currentAmount += amount;
  return this.save();
};

const Campaign = mongoose.model('Campaign', campaignSchema);

module.exports = Campaign;
