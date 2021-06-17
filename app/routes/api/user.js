var express = require("express");
var router = express.Router();
var userController = require("../../controllers/UserController.js");
var { check } = require("express-validator");

// middlewares
const auth = require("../../middleware/auth");

router.post(
  "/name",
  [auth, check("username", "username is required").not().isEmpty()],
  userController.saveName
);
router.get("/profile", auth, userController.getProfile);

module.exports = router;
