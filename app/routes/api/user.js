var express = require('express');
var router = express.Router();
var usersController = require('../../controllers/UsersController.js');

// middlewares
const auth = require('../../middleware/auth');


router.post('/name', auth, usersController.saveName);
router.get('/profile', auth,usersController.fetchProfile);



module.exports = router;
