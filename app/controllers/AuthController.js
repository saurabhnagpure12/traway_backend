const { validationResult } = require("express-validator");
const nodemailer = require("nodemailer");
const config = require('../../config/app.js');
const jwt = require("jsonwebtoken");
const validator = require("../util/validations.js");
const mailer = require("../util/mailer.js");

// Load Models
const User = require("../models/User");

function generateOTP() {
  let otp = Math.floor(100000 + Math.random() * 900000);
  return otp;
}

// @route http://localhost:5000/api/v1/authenticate
exports.sendOTP = async function (req, res) {
  try {
    // For sending the user state as response userStatemessage is used defaults to USER_CREATED will change if user exist in DB

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    let otp = generateOTP();
    const { email } = req.body;
    const date = new Date();
    // set expiry date with current date +  (min * sec * milliseconds) since Date.getTime() return in milliSeconds
    const expiry_date = date.getTime() + 2 * 60 * 1000;
    // Check if User Exists
    const user = await User.findOne({ email });

    await User.findOneAndUpdate(
      { email: email },
      {
        $set: {
          email: email,
          otp: {
            number: otp,
            expires_at: expiry_date,
          },
        },
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    );

    // Send Email
    const message = {
      from: config.app.nodemailer.user_email, // Sender address
      to: email, // List of recipients
      subject: "Here's your OTP for login", // Subject line
      html: `Hey,<br> This is your OTP: ${otp}<br><br>Team Ermin Traway`,
    };
    mailer.transporter.sendMail(message, function (err, info) {
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
      .json({ data: [{ msg: "OTP sent To your email ID " }] });
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
    if (!user) {
      return res.status(400).json({ errors: [{ msg: "User Does Not Exist" }] });
    }
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
            new: true, // return document
          }
        );
        const payload = {
          user: {
            id: updatedUser.id,
          },
        };
        jwt.sign(payload, config.app.jwt_secret, {}, (err, token) => {
          if (err) {
            console.error(err);
            throw err;
          }

          let is_new_user = user.name == undefined ? true : false;
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
  } catch (err) {
    // end try
    console.error(err.message);
    if (err.message === "OTP is Not Valid") {
      return res.status(400).json({ errors: [{ msg: err.message }] });
    }
    if (err.message === "OTP Expired") {
      return res.status(400).json({ errors: [{ msg: err.message }] });
    }
    return res.status(500).json({ errors: [{ msg: "Server Error" }] });
  }
};




exports.logoutUser = async function (req, res) {
  try{
    const checkUser = await User.findById(req.user.id);
    if (!checkUser) {
      return res.status(400).json({ data: [{ msg: "Invalid Auth Token" }] });
    }
    await User.remove("");
  }
  catch (err) {
    return res.status(500).json({ errors: [{ msg: "Server Error" }] });
  }

};
