// Load Models
const User = require("../models/User");
const { validationResult } = require("express-validator");

exports.saveName = async function (req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name } = req.body;
    const user= await User.findById(req.user.id);
    if(!user){
      return res.status(400).json({ errors: [{ msg: "User Does Not Exist" }] });
    }
    await User.updateOne(
      { _id: req.user.id },
      {
        $set: {
           name
        },
      }
    );
    return res
      .status(200)
      .json({ data: [{ msg: "User Updated Successfully" }] });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ errors: [{ msg: "Server Error" }] });
  }
};

exports.getProfile = async function (req, res) {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(400).json({ data: [{ msg: "User Does Not Exist" }] });
    }
    return res.status(200).json({ data: user });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ errors: [{ msg: "Server Error" }] });
  }
};
