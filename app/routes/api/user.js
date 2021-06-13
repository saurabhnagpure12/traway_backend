var express = require('express');
var router = express.Router();
var userController = require('../../controllers/UserController.js');

// middlewares
const auth = require('../../middleware/auth');


router.post('/name', auth, userController.saveName);
router.get('/profile', auth, userController.getProfile);



module.exports = router;
