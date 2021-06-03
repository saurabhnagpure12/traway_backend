var express = require('express');
var router = express.Router();
var authRouter = require("./api/auth.js");
var mapsRouter = require("./api/maps.js");


router.use("/authenticate", authRouter); 
router.use("/maps", mapsRouter);


module.exports = router;
