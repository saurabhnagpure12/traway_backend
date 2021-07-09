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
exports.postReactions = async function (req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { suggestions, feedback } = req.body;
    let report_bug = "";
    if (req.body.report_bug) {
      report_bug = req.body.report_bug;
    }
    await new Reaction({
      user: req.user.id,
      suggestion: suggestions,
      feedback,
      report_bug,
    }).save();
    return res.status(200).json({
      data: [{ msg: "Thanks for the feedback we will get back soon..." }],
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ errors: [{ msg: "Server Error" }] });
  }
};
