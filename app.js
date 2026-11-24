// ---------- Setup: environment and imports ----------
require('dotenv').config();
const path = require('node:path');
const express = require('express');
const pool = require('./db/pool');
const authRouter = require('./routes/authRouter');

// ---------- App and config ----------
const app = express();
const PORT = process.env.PORT || 3000;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// ---------- Middleware (runs on every request, in this order) ----------
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// ---------- Routes ----------
app.use('/', authRouter); // /sign-up, /log-in, /log-out
// app.use('/club', clubRouter);      // /club/join, /club/admin
// app.use('/', messagesRouter);      // /, /new, /:id/delete

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
