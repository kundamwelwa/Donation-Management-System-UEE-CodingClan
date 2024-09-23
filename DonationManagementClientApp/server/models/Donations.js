// models/Donations.js
const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema(
  {
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Donor', // Reference to the Donor model
      required: true,
    },
    campaign: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Campaign', // Reference to the Campaign model
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: [1, 'Donation amount must be at least $1'],
    },
    paymentMethod: {
      type: String,
      enum: ['Credit Card', 'Debit Card', 'PayPal', 'Bank Transfer'],
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'refunded', 'canceled'],
      default: 'pending',
    },
    transactionId: {
      type: String, // Unique identifier for the transaction (e.g., from payment gateway)
      required: false,
    },
    notes: {
      type: String, // Optional notes from the donor
      required: false,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Middleware to perform actions before saving a donation
donationSchema.pre('save', async function (next) {
 
  if (this.isModified('status') && this.status === 'completed') {
    const Campaign = mongoose.model('Campaign');
    const campaign = await Campaign.findById(this.campaign);
    if (campaign) {
      campaign.currentAmount += this.amount;
      // Optionally, update campaign status if target is reached
      if (campaign.currentAmount >= campaign.targetAmount && campaign.status === 'active') {
        campaign.status = 'completed';
      }
      await campaign.save();
    }
  }
  next();
});

// Middleware to perform actions before removing a donation
donationSchema.pre('remove', async function (next) {
  // If a donation is removed and was completed, update the campaign's total
  if (this.status === 'completed') {
    const Campaign = mongoose.model('Campaign');
    const campaign = await Campaign.findById(this.campaign);
    if (campaign) {
      campaign.currentAmount -= this.amount;
      // Optionally, revert campaign status if below target
      if (campaign.currentAmount < campaign.targetAmount && campaign.status === 'completed') {
        campaign.status = 'active';
      }
      await campaign.save();
    }
  }
  next();
});

// Static method to calculate total donations for a campaign
donationSchema.statics.calculateTotalDonations = async function (campaignId) {
  const result = await this.aggregate([
    { $match: { campaign: mongoose.Types.ObjectId(campaignId), status: 'completed' } },
    { $group: { _id: '$campaign', totalAmount: { $sum: '$amount' } } },
  ]);
  return result[0] ? result[0].totalAmount : 0;
};

const Donation = mongoose.model('Donations', donationSchema);

module.exports = Donation;
