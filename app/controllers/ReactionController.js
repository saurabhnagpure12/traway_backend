// Import Dependencies
const { validationResult } = require("express-validator");

// Load Models
const Reaction = require("../models/Reaction");

exports.getAllReactionByUser = async function (req, res) {
  try {
    Reaction.aggregate(
      [
        {
          $lookup: {
            from: "users",
            localField: "user",
            foreignField: "_id",
            as: "members.user",
          },
        },
      ],
      function (error, data) {
        if (error != null) {
          return res.status(500).json({
            status: "failed",
            msg: error,
          });
        }
        return res.status(200).json({
          status: "success",
          msg: "User circles fetched",
          data: data,
        });
      }
    );
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ errors: [{ msg: "Server Error" }] });
  }
};


exports.getReactions = async function (req, res) {
  try {
    const reactions = await Reaction.find();
    return res.status(200).json({ data: reactions });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ errors: [{ msg: "Server Error" }] });
  }
};



exports.addReaction = async function (req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { message, reaction_type } = req.body;

    await new Reaction({
      user: req.user.id,
      message,
      reaction_type
    }).save();

    return res.status(200).json({
      data: [{ msg: "Reaction Stored" }],
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ errors: [{ msg: "Failed adding reaction" }] });
  }
};
