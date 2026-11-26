const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const pool = require('../db/pool');

passport.use(
  new LocalStrategy(async (username, password, done) => {
    console.log('🔥 LOCAL STRATEGY TRIGGERED!');
    console.log('Username received:', username);
    try {
      const { rows } = await pool.query(
        'SELECT * FROM users WHERE username = $1',
        [username.toLowerCase()],
      );
      const user = rows[0];

      if (!user) {
        return done(null, false, { message: 'Incorrect username' });
      }
      const match = await bcrypt.compare(password, user.password_hash);
      if (!match) {
        return done(null, false, { message: 'Incorrect password' });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }),
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const { rows } = await pool.query(
      'SELECT id, username, first_name, last_name, is_member, is_admin FROM users WHERE id = $1',
      [id],
    );
    const user = rows[0];

    if (!user) {
      return done(null, false);
    }

    done(null, user);
  } catch (err) {
    done(err);
  }
});

module.exports = passport;
