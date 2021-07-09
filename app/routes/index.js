var express = require("express");
var router = express.Router();
var authRouter = require("./api/auth.js");
var userRouter = require("./api/user.js");
var mapsRouter = require("./api/maps.js");
var circleRouter = require("./api/circle.js");
var reactionRouter = require("./api/reaction.js");

router.use("/authenticate", authRouter);
router.use("/users", userRouter);
router.use("/maps", mapsRouter);
router.use("/circles", circleRouter);
router.use("/reactions", reactionRouter);

module.exports = router;
