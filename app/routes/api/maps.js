var express = require('express');
var router = express.Router();
var mapsController = require('../../controllers/MapsController.js');


router.post('/users/locations', mapsController.storeUserLocationSearch);
router.post('/routes', mapsController.storeRoute);



module.exports = router;
