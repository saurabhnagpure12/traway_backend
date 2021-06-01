const { validationResult } = require('express-validator');
const nodemailer = require("nodemailer");
const config = require("config");
const validator = require('../util/validations.js');
const configuration = require('../util/configurations.js');


exports.sendOTP = function (req, res) {

  try{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {email} = req.body;
    const message = {
       from: config.get('nodemailerUserEmail'), // Sender address
       to: email, // List of recipients
       subject: "Here's your OTP for login", // Subject line
       html: "Hey,<br> This is your OTP: 123456<br><br>Team Ermin Traway"
   };
   configuration.transporter.sendMail(message, function(err, info) {
       if (err) {
         console.log(err);
       } else {
         console.log(info);
       }
   });
   
   res.status(200).json({
     data: "OTP sent to email id"
   });


  }
  catch(err){
    res.status(500).json({
      data: err.message
    });
  }


}


exports.verifyOTP = function (req, res) {

}
