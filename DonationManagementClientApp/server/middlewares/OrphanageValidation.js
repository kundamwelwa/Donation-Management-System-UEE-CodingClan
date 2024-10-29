const { check, validationResult } = require('express-validator');

// Validation rules for orphanage signup
exports.validateOrphanageSignup = [
  check('orphanageName')
    .notEmpty()
    .withMessage('Orphanage name is required'),

  check('regNumber')
    .notEmpty()
    .withMessage('Registration number is required'),

  check('orgType')
    .isIn(['non-profit', 'government', 'private'])
    .withMessage('Type of orphanage is invalid'),

  check('contactName')
    .notEmpty()
    .withMessage('Contact person name is required'),

  check('contactPosition')
    .notEmpty()
    .withMessage('Contact position is required'),

  check('email')
    .isEmail()
    .withMessage('Invalid email')
    .notEmpty()
    .withMessage('Email is required'),

  check('physicalAddress')
    .notEmpty()
    .withMessage('Physical address is required'),

  check('contactDetails')
    .notEmpty()
    .withMessage('Contact details are required'),

  check('numberOfChildren')
    .isNumeric()
    .withMessage('Number of children must be a number'),

  check('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),

  // Middleware to handle validation errors
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const formattedErrors = errors.array().map(error => ({
        field: error.param,
        message: error.msg
      }));
      return res.status(400).json({ errors: formattedErrors });
    }
    next();
  },
];

// Validation rules for orphanage login
exports.validateOrphanageLogin = [
  check('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email'),

  check('password')
    .notEmpty()
    .withMessage('Password is required'),

  // Middleware to handle validation errors
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const formattedErrors = errors.array().map(error => ({
        field: error.param,
        message: error.msg
      }));
      return res.status(400).json({ errors: formattedErrors });
    }
    next();
  },
];
