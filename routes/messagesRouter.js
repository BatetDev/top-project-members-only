const express = require('express');
const router = express.Router();
const messagesController = require('../controllers/messagesController');
const { ensureAuth, ensureAdmin } = require('../middleware/auth');

router.use(ensureAuth); // everything below requires login

router.get('/new', messagesController.newGet); // GET /messages/new -> the new message form
router.post('/', messagesController.newPost); // POST /messages -> save the new message
router.post('/:id/delete', ensureAdmin, messagesController.deletePost); // POST /messages/:id/delete -> admins only

module.exports = router;
