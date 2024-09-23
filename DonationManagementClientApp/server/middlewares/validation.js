const { check, validationResult } = require('express-validator');

exports.validateSignup = [
  check('userType').isIn(['Personal', 'organization']).withMessage('User type is invalid'),
  check('email').isEmail().withMessage('Email is invalid'),
  check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  check('physicalAddress').notEmpty().withMessage('Physical address is required'),
  check('contactDetails').notEmpty().withMessage('Contact details are required'),

  check('fullName').if((_, { req }) => req.body.userType === 'Personal')
    .notEmpty().withMessage('Full name is required for personal accounts'),

  check('orgName').if((_, { req }) => req.body.userType === 'organization')
    .notEmpty().withMessage('Organization name is required for organization accounts'),

  check('orgRegNumber').if((_, { req }) => req.body.userType === 'organization')
    .notEmpty().withMessage('Organization registration number is required for organization accounts'),

  check('orgType').if((_, { req }) => req.body.userType === 'organization')
    .notEmpty().withMessage('Organization type is required for organization accounts'),

  check('contactName').if((_, { req }) => req.body.userType === 'organization')
    .notEmpty().withMessage('Contact name is required for organization accounts'),

  check('contactPosition').if((_, { req }) => req.body.userType === 'organization')
    .notEmpty().withMessage('Contact position is required for organization accounts'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

exports.validateLogin = [
  check('email').isEmail().withMessage('Email is invalid'),
  check('password').notEmpty().withMessage('Password is required'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
