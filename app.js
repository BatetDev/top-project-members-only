// ---------- Setup: environment and imports ----------
require('dotenv').config();
require('./config/passport'); // Load the strategy configuration
const path = require('node:path');
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const pool = require('./db/pool');
const authRouter = require('./routes/authRouter');
const clubRouter = require('./routes/clubRouter');
const messagesRouter = require('./routes/messagesRouter');

// ---------- App and config ----------
const app = express();
const PORT = process.env.PORT || 3000;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// ---------- Middleware (runs on every request, in this order) ----------
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET, // signs the session cookie
    resave: false, // don't re-save a session that didn't change
    saveUninitialized: false, // don't create a session until something is stored in it
  }),
);
app.use(passport.session()); // reads the session on each request and sets req.user
// Make the logged-in user available to ALL EJS templates
app.use((req, res, next) => {
  res.locals.currentUser = req.user; // If logged, this is the user object. Otherwise, it's undefined.
  next();
});

// ---------- Routes ----------
app.get('/', async (req, res) => {
  const { rows } = await pool.query(`
      SELECT messages.id, messages.title, messages.body, messages.created_at, users.username
      FROM messages
      JOIN users ON messages.user_id = users.id
      ORDER BY messages.created_at DESC`);
  res.render('index', { messages: rows });
});

app.use('/', authRouter); // /sign-up, /log-in, /log-out
app.use('/club', clubRouter); // /club/join, /club/admin
app.use('/messages', messagesRouter); // /, /new, /:id/delete

// ---------- Fallbacks (must come after all routes) ----------
app.use((req, res) => {
  res.status(404).send('Page not found');
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Something went wrong');
});

// ---------- Start ----------
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
