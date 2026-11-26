const express = require('express');
const router = express.Router();
const clubController = require('../controllers/clubController');
const { ensureAuth } = require('../middleware/auth');

router.use(ensureAuth); // everything below requires login

router.get('/join', clubController.joinGet); // GET  /club/join -> the passcode form
router.post('/join', clubController.joinPost); // POST /club/join -> check the passcode

module.exports = router;
