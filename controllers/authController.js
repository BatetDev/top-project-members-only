const pool = require('../db/pool');
const { body, validationResult } = require('express-validator');

exports.signUpGet = (req, res) => {
  res.render('sign-up', { errors: [], formData: {} });
};

const validateSignUp = [
  body('firstName')
    .trim()
    .notEmpty()
    .withMessage('First name is required')
    .isLength({ max: 100 })
    .withMessage('First name is too long (max 100 characters)'),
  body('lastName')
    .trim()
    .notEmpty()
    .withMessage('Last name is required')
    .isLength({ max: 100 })
    .withMessage('Last name is too long (max 100 characters)'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Enter a valid email')
    .toLowerCase(),
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username is required')
    .isLength({ max: 50 })
    .withMessage('Username is too long (max 50 characters)'),
  body('password').isLength({ min: 8 }).withMessage('At least 8 characters'),
  body('confirmPassword')
    .custom((value, { req }) => value === req.body.password)
    .withMessage('Passwords do not match'),
];

exports.signUpPost = [
  validateSignUp,
  async (req, res) => {
    const errors = validationResult(req);
    const { password, confirmPassword, ...formData } = req.body;

    if (!errors.isEmpty()) {
      return res
        .status(400)
        .render('sign-up', { errors: errors.array(), formData });
    }
    // bcrypt + insert will go here
  },
];
