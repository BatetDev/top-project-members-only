const pool = require('../db/pool');
const { body, validationResult } = require('express-validator');

const validateMessage = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 100 })
    .withMessage('Title is too long (max 100 characters)'),
  body('body').trim().notEmpty().withMessage('Message is required'),
];

// GET /messages/new -> show the new message form
exports.newGet = (req, res) => {
  res.render('new-message', { errors: [] });
};

// POST /messages -> validate, then save the new message
exports.newPost = [
  validateMessage,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render('new-message', { errors: errors.array() });
    }

    try {
      await pool.query(
        'INSERT INTO messages (title, body, user_id) VALUES ($1, $2, $3)',
        [req.body.title, req.body.body, req.user.id],
      );
      res.redirect('/');
    } catch (err) {
      next(err); // a database problem is unexpected: let the error handler deal with it
    }
  },
];

// POST /messages/:id/delete -> admins only
exports.deletePost = async (req, res, next) => {
  try {
    const messageId = req.params.id;
    await pool.query('DELETE FROM messages WHERE id = $1', [messageId]);
    res.redirect('/');
  } catch (err) {
    next(err);
  }
};
