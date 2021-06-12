var express = require('express');
var router = express.Router();
var mapsController = require('../../controllers/MapsController.js');

// middlewares
const auth = require('../../middleware/auth');


router.post('/locations', auth, mapsController.storeUserLocationSearch);
router.post('/routes', auth, mapsController.storeRoute);



module.exports = router;
