const { body, validationResult } = require('express-validator');

/**
 * Validate Campaign Creation
 */
const validateCampaignCreation = [
  body('name')
    .notEmpty()
    .withMessage('Name is required.')
    .isString()
    .withMessage('Name must be a string.'),
  body('description')
    .notEmpty()
    .withMessage('Description is required.')
    .isString()
    .withMessage('Description must be a string.'),
  body('targetAmount')
    .notEmpty()
    .withMessage('Target amount is required.')
    .isFloat({ gt: 0 })
    .withMessage('Target amount must be a positive number.'),
  // Additional validations as needed
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

/**
 * Validate Campaign Update
 */
const validateCampaignUpdate = [
  body('name')
    .optional()
    .isString()
    .withMessage('Name must be a string.'),
  body('description')
    .optional()
    .isString()
    .withMessage('Description must be a string.'),
  body('targetAmount')
    .optional()
    .isFloat({ gt: 0 })
    .withMessage('Target amount must be a positive number.'),
  body('status')
    .optional()
    .isIn(['active', 'completed', 'failed'])
    .withMessage('Status must be active, completed, or failed.'),
  // Additional validations as needed
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

/**
 * Validate Donation Creation
 */
const validateDonationCreation = [
  body('campaignId')
    .notEmpty()
    .withMessage('Campaign ID is required.')
    .isMongoId()
    .withMessage('Campaign ID must be a valid Mongo ID.'),
  body('amount')
    .notEmpty()
    .withMessage('Amount is required.')
    .isFloat({ gt: 0 })
    .withMessage('Amount must be a positive number.'),
  body('paymentMethod')
    .notEmpty()
    .withMessage('Payment method is required.')
    .isIn(['Credit Card', 'Debit Card', 'PayPal', 'Bank Transfer'])
    .withMessage('Invalid payment method.'),
  // Additional validations as needed
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

/**
 * Validate Donation Update
 */
const validateDonationUpdate = [
  body('status')
    .notEmpty()
    .withMessage('Status is required.')
    .isIn(['pending', 'completed', 'refunded', 'canceled'])
    .withMessage('Status must be pending, completed, refunded, or canceled.'),
  // Additional validations as needed
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = {
  validateCampaignCreation,
  validateCampaignUpdate,
  validateDonationCreation,
  validateDonationUpdate,
};
