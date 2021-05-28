// Dependencies
const express = require("express");
const { check, validationResult } = require("express-validator");
const bcrypt = require('bcryptjs');
const path = require('path');
const jwt = require('jsonwebtoken');
const config = require('config');
const router = express.Router();


// Load Models
const User = require("../../models/User");

// @route POST /api/users/signup
// @desc Register a user
// @access public
router.post(
  "/signup",
  [
    check("name", "name is required").not().isEmpty(),
    check("email", "Email is Required").isEmail(),
    check("password", "Password must be minimum of 6 characters").isLength({
      min: 6,
    }),
    check("phone", "phone is required").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    // Check for errors
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, phone, password } = req.body;
    let filePath = "";
    if(req.files){
        //Assuming file is the name of input that s of type file
        let myFile = req.files.file;
        // Moving file to public profileuploads directory
        myFile.mv(path.join(__dirname, `../../public/profileUploads/${myFile.name}`),(err) => {
          if(err) console.error(err);
          else{
            filePath = path.join(__dirname, `../../public/profileUploads/${myFile.name}`)
          }
        });
    }
    try {
      const user = await User.findOne({ email });
      // check if usr exist
      if (!user) {
          const genSalt = await bcrypt.genSalt(10);
          const hashed = await bcrypt.hash(password, genSalt);
          const newUser = {
              name,
              email,
              password: hashed,
              phone,
              profile_pic: filePath !== "" ? filePath : ""
          }
          // Get hold of registered user from database
          const createdUser = await new User(newUser).save();
          const payload = {
            user : {
              id: createdUser.id
            }
          }
          // Generating token
          jwt.sign(payload,config.get('jwtSecret'),{
            expiresIn: 3600 // expires in 1 hours
          },
          (err, token) => {
            if (err) throw err;
            return res.json({ token });
          });
        } 
      else {
        return res.status(400).json({ errors : [{'msg': "User Already Exists" }]});
      }
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ errors : [{'msg': "Server Error" }]});
    }
  }
);
module.exports = router;
