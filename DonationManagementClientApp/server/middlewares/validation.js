const { check, validationResult } = require('express-validator');

// Signup Validation Middleware
exports.validateSignup = [
  // User Type Validation
  check('userType').isIn(['single', 'organization']).withMessage('User type is invalid'),
  
  // Email Validation
  check('email').isEmail().withMessage('Email is invalid'),
  
  // Password Validation
  check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),

  // Common Fields Validation
  check('physicalAddress').notEmpty().withMessage('Physical address is required'),
  check('contactDetails').notEmpty().withMessage('Contact details are required'),

  // Conditional Validation Based on User Type
  check('fullName').if((value, { req }) => req.body.userType === 'single')
    .notEmpty().withMessage('Full name is required for personal accounts'),
  
  check('orgName').if((value, { req }) => req.body.userType === 'organization')
    .notEmpty().withMessage('Organization name is required for organization accounts'),

  check('orgRegNumber').if((value, { req }) => req.body.userType === 'organization')
    .notEmpty().withMessage('Organization registration number is required for organization accounts'),
  
  check('orgType').if((value, { req }) => req.body.userType === 'organization')
    .notEmpty().withMessage('Organization type is required for organization accounts'),

  check('contactName').if((value, { req }) => req.body.userType === 'organization')
    .notEmpty().withMessage('Contact name is required for organization accounts'),

  check('contactPosition').if((value, { req }) => req.body.userType === 'organization')
    .notEmpty().withMessage('Contact position is required for organization accounts'),

  // Custom Validation Error Handler
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Login Validation Middleware
exports.validateLogin = [
  // Email Validation
  check('email').isEmail().withMessage('Email is invalid'),
  
  // Password Validation
  check('password').notEmpty().withMessage('Password is required'),

  // Custom Validation Error Handler
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
