const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/sign-up', authController.signUpGet);
router.post('/sign-up', authController.signUpPost); // validation + bcrypt

router.get('/log-in', authController.logInGet);
router.post('/log-in', authController.logInPost); // passport.authenticate(...)

/*
router.post('/log-out', authController.logOut);
*/

module.exports = router;
