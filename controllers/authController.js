const pool = require('../db/pool');

exports.signUpGet = (req, res) => {
  res.render('sign-up');
};
