// ---------- 1. Setup: environment and imports ----------
require('dotenv').config();
const path = require('node:path');
const express = require('express');
const pool = require('./db/pool');

// ---------- 2. App and config ----------
const app = express();
const PORT = process.env.PORT || 3000;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// ---------- 3. Middleware (runs on every request, in this order) ----------
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// ---------- 4. Routes ----------
app.get('/', (req, res) => {
  res.render('index');
});

// ---------- 5. Fallbacks (must come after all routes) ----------
app.use((req, res) => {
  res.status(404).send('Page not found');
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Something went wrong');
});

// ---------- 6. Start ----------
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
