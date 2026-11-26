const pool = require('../db/pool');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const passport = require('passport');

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
    .toLowerCase()
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
  async (req, res, next) => {
    const errors = validationResult(req);
    const { password, confirmPassword, ...formData } = req.body;

    if (!errors.isEmpty()) {
      return res
        .status(400)
        .render('sign-up', { errors: errors.array(), formData });
    }

    try {
      const passwordHash = await bcrypt.hash(password, 10);
      await pool.query(
        `INSERT INTO users (first_name, last_name, username, email, password_hash)
         VALUES ($1, $2, $3, $4, $5)`,
        [
          formData.firstName,
          formData.lastName,
          formData.username,
          formData.email,
          passwordHash,
        ],
      );
      res.redirect('/log-in');
    } catch (err) {
      if (err.code === '23505') {
        return res.status(400).render('sign-up', {
          errors: [{ msg: 'Username or email already in use' }],
          formData,
        });
      }
      next(err);
    }
  },
];

exports.logInGet = (req, res) => {
  res.render('log-in', { errors: [], formData: {} });
};

exports.logInPost = passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/log-in',
});

/*
router.get('/log-in', authController.logInGet);
router.post('/log-in', authController.logInPost); // passport.authenticate(...)
*/
