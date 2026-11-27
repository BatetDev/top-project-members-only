const express = require('express');
const router = express.Router();
const messagesController = require('../controllers/messagesController');
const { ensureAuth } = require('../middleware/auth');

router.use(ensureAuth); // everything below requires login

router.get('/new', messagesController.newGet); // GET /messages/new -> the new message form
router.post('/', messagesController.newPost); // POST /messages -> save the new message

module.exports = router;
