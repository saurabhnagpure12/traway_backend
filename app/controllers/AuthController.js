const { validationResult } = require('express-validator');
const nodemailer = require("nodemailer");
const config = require("config");
const validator = require('../util/validations.js');
const configuration = require('../util/configurations.js');


exports.sendOTP = function (req, res) {

  try{
    const {emailPhone} = req.body;

    if(validator.isEmail(emailPhone)){

      const message = {
         from: config.get('nodemailerUserEmail'), // Sender address
         to: emailPhone, // List of recipients
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

    }
    // if(validator.isPhone(emailPhone)){
    //
    // }

    res.status(400).json({
      data: "invalid email or phone number"
    });


  }
  catch(err){
    res.status(500).json({
      data: err.message
    });
  }


}
