var express = require('express');
var router = express.Router();
var authRouter = require("./api/auth.js");

router.use("/authenticate", authRouter);


module.exports = router;
