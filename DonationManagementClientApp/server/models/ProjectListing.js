const mongoose = require('mongoose');

// Define the ProjectListing schema, designed to manage projects with fields similar to Campaigns
const projectListingSchema = new mongoose.Schema(
  {
    projectName: {
      type: String,
      required: [true, 'Project name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Project description is required'],
      trim: true,
    },
    projectType: {
      type: String,
      required: [true, 'Project type is required'],
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
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    imageUri: {
      type: String,
      required: [true, 'Image URI is required'],
      trim: true,
    },
    projectedAmount: {
      type: Number,
      required: [true, 'Projected amount is required'],
      min: [1, 'Projected amount must be at least $1'],
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
      ref: 'Orphanages', // Referencing the Orphanage model
      required: [true, 'Orphanage is required'], // Ensures every project has an associated orphanage
    },
  },
  { timestamps: true }
);

// Middleware to automatically update status based on currentAmount and dates
projectListingSchema.pre('save', function (next) {
  if (this.currentAmount >= this.projectedAmount && this.status === 'active') {
    this.status = 'completed';
  } else if (this.endDate < Date.now() && this.status === 'active') {
    this.status = 'failed';
  }
  next();
});

// Method to update currentAmount and check for completion
projectListingSchema.methods.updateCurrentAmount = function (amount) {
  this.currentAmount += amount;
  return this.save();
};

// Create and export the ProjectListing model based on the schema
const ProjectListing = mongoose.model('ProjectListing', projectListingSchema);
module.exports = ProjectListing;
