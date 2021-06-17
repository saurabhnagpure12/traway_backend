// Load Models
const User = require("../models/User");
const { validationResult } = require("express-validator");

exports.saveName = async function (req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { username } = req.body;
    await User.updateOne(
      { _id: req.user.id },
      {
        $set: {
          username,
        },
      }
    );
    return res.status(200).json({ data : [{ msg: "User Updated Successfully" }] });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ errors: [{ msg: "Server Error" }] });
  }
};

exports.getProfile = async function (req, res) {};
