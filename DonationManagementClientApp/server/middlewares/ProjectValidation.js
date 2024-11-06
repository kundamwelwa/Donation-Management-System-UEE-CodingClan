const { body, validationResult } = require('express-validator');

/**
 * Validation rules for creating a project.
 */
const validateProjectCreation = [
  body('projectName')
    .notEmpty().withMessage('Project name is required.')
    .isString().withMessage('Project name must be a string.')
    .trim(),
  
  body('description')
    .notEmpty().withMessage('Description is required.')
    .isString().withMessage('Description must be a string.')
    .trim(),

    body('projectType')
    .notEmpty().withMessage('projectType is required.')
    .isString().withMessage('projectType must be a string.')
    .trim(),
  
  body('projectedAmount')
    .notEmpty().withMessage('Target amount is required.')
    .isNumeric().withMessage('Target amount must be a number.'),
  
  body('category')
    .notEmpty().withMessage('Category is required.')
    .isString().withMessage('Category must be a string.')
    .trim(),
  
  body('startDate')
    .notEmpty().withMessage('Start date is required.')
    .isISO8601().withMessage('Start date must be a valid date format (YYYY-MM-DD).'),
  
  body('endDate')
    .notEmpty().withMessage('End date is required.')
    .isISO8601().withMessage('End date must be a valid date format (YYYY-MM-DD).'),
  
  body('location')
    .notEmpty().withMessage('Location is required.')
    .isString().withMessage('Location must be a string.')
    .trim(),
  
  // Additional field validations can go here (if necessary)
];

/**
 * Validation rules for updating a project.
 */
const validateProjectUpdate = [
  body('projectName')
    .optional()
    .isString().withMessage('Project name must be a string.')
    .trim(),
  
  body('description')
    .optional()
    .isString().withMessage('Description must be a string.')
    .trim(),
  
  body('projectedAmount')
  .notEmpty()
  .withMessage('Target amount is required.')
  .isFloat({ gt: 0 })
  .withMessage('Target amount must be a positive number.'),
  
  body('category')
    .optional()
    .isString().withMessage('Category must be a string.')
    .trim(),
  
  body('location')
    .optional()
    .isString().withMessage('Location must be a string.')
    .trim(),
  
  // Additional field validations can go here (if necessary)
];

/**
 * Middleware to handle validation results.
 */
const validateProject = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = {
  validateProjectCreation,
  validateProjectUpdate,
  validateProject,
};
