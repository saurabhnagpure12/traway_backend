var express = require('express');
var router = express.Router();
var authRouter = require("./api/auth.js");
var userRouter = require("./api/user.js");
var mapsRouter = require("./api/maps.js");
var circleRouter = require("./api/circle.js");
var cipherRouter = require("./api/cipher.js");



router.use("/authenticate", authRouter);
router.use("/users", userRouter);
router.use("/maps", mapsRouter);
router.use("/circles", circleRouter);
router.use("/ciphers", cipherRouter);



module.exports = router;
