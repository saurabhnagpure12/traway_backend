var express = require("express");
var router = express.Router();
var reactionController = require("../../controllers/ReactionController.js");
const { check } = require("express-validator");

// middlewares
const auth = require("../../middleware/auth");

// @route /api/v1/reactions
router.get("/", auth, reactionController.getReactions);

// @route /api/v1/reactions/user
router.get("/user", auth, reactionController.getAllReactionByUser);

// @route /api/v1/reactions
router.post(
  "/",
  [
    auth,
    check("message", "message is required").not().isEmpty(),
    check("reaction_type", "reaction type is required").not().isEmpty(),
  ],
  reactionController.addReaction
);

module.exports = router;
