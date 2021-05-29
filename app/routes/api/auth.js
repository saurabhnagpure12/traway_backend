var express = require('express');
var router = express.Router();
var authController = require('../../controllers/AuthController.js');
const { check } = require('express-validator');



router.post('/', authController.sendOTP);







module.exports = router;
