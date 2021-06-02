var express = require('express');
var router = express.Router();
var authController = require('../../controllers/AuthController.js');
const { check } = require('express-validator');


// @route /api/v1/authenticate
router.post(
  '/',
  check("email", "Email must be valid and required").isEmail(),
  authController.sendOTP
);

// @route /api/v1/authenticate/verify
router.post('/verify',[
  check("email", "Email must be valid and required").isEmail(),
  check("OTP", "OTP is Required").not().isEmpty()
], authController.verifyOTP);






module.exports = router;
