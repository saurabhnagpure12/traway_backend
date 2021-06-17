const { validationResult } = require("express-validator");
const nodemailer = require("nodemailer");
const config = require("config");
const jwt = require("jsonwebtoken");
const validator = require("../util/validations.js");
const configuration = require("../util/configurations.js");

// Load Models
const User = require("../models/User");

function generateOTP() {
  let otp = Math.floor(100000 + Math.random() * 900000);
  return otp;
}

// @route http://localhost:5000/api/v1/authenticate
exports.sendOTP = async function (req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    let otp = generateOTP();
    const { email } = req.body;
    const date = new Date();
    // set expiry date with current date +  (min * sec * milliseconds) since Date.getTime() return in milliSeconds
    const expiry_date = date.getTime() + 2 * 60 * 1000;
    // Check if user exists if he does update else create new one and return document with updated fields
    const user = await User.findOneAndUpdate(
      { email },
      {
        $set: {
          email,
          otp: {
            number: otp,
            expires_at: expiry_date,
          },
        },
      },
      {
        new: true, // return document
        upsert: true, // creates new document
        setDefaultsOnInsert: true,
      }
    );
    // Send Email
    const message = {
      from: config.get("nodemailerUserEmail"), // Sender address
      to: email, // List of recipients
      subject: "Here's your OTP for login", // Subject line
      html: `Hey,<br> This is your OTP: ${otp}<br><br>Team Ermin Traway`,
    };
    configuration.transporter.sendMail(message, function (err, info) {
      if (err) {
        console.log(err);
        throw new Error("Cannot Send Email");
      } else {
        console.log(info);
      }
    });
    // TODO: change res data structure and if user is new or existing
    return res
      .status(200)
      .json({ data : [{ msg: "OTP sent To your email ID " }] });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ errors: [{ msg: "Server Error" }] });
  }
};

exports.verifyOTP = async function (req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, OTP } = req.body;
    const user = await User.findOne({ email });

    const currentDate = new Date();
    const expiryDate = user.otp.expires_at;
    // console.log(expiryDate, expiryDate.getHours(), expiryDate.getMinutes());
    // Check for validation of otp
    if (currentDate.getTime() <= expiryDate) {
      if (user.otp.number === OTP) {
        // return token and flush old otp
        // Get hold of returned document from mongoose
        const updatedUser = await User.findByIdAndUpdate(
          user.id,
          {
            $set: {
              otp: {},
            },
          },
          {
            new : true // return document
          }
        );
        const payload = {
          user: {
            id: updatedUser.id,
          },
        };
        jwt.sign(payload, config.get("jwtSecret"), {}, (err, token) => {
          if (err) {
            console.error(err);
            throw err;
          }
          let is_new_user = (user.username)? false: true;
          return res.status(200).json({ is_new_user, token });
        });
      } // End if for otp comparision
      else {
        throw new Error("OTP is Not Valid");
      }
    } // end if for time comparision
    else {
      throw new Error("OTP Expired");
    }
  } // end try
  catch (err) {
    console.error(err.message);
    if(err.message === "OTP is Not Valid") {
      return res.status(400).json({ errors: [{ msg: err.message }] });
    }
    if(err.message === "OTP Expired"){
      return res.status(400).json({ errors: [{ msg: err.message }] });
    }
    return res.status(500).json({ errors: [{ msg: "Server Error" }] });
  }
};
