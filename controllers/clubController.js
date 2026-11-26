const pool = require('../db/pool');

// GET /club/join -> show the passcode form
exports.joinGet = (req, res) => {
  res.render('join-club', { errors: [] });
};

// POST /club/join -> check the passcode and make the user a member
exports.joinPost = async (req, res, next) => {
  // 1. Wrong passcode: show the form again and stop
  if (req.body.passcode !== process.env.CLUB_PASSCODE) {
    return res.status(400).render('join-club', {
      errors: [{ msg: 'Passcode is incorrect' }],
    });
  }

  // 2. Right passcode: mark the logged-in user as a member
  try {
    await pool.query('UPDATE users SET is_member = true WHERE id = $1', [
      req.user.id,
    ]);
    res.redirect('/');
  } catch (err) {
    next(err); // a database problem is unexpected: let the error handler deal with it
  }
};
