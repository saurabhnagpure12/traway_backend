var express = require('express');
var router = express.Router();
var authController = require('../../controllers/AuthController.js');
const { check } = require('express-validator');



router.post(
  '/',
  check("email", "Email must be valid and required").isEmail(),
  authController.sendOTP
);
// router.post('/verify', authController.veryOTP);






module.exports = router;
