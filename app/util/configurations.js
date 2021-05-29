const nodemailer = require("nodemailer");
const config = require("config");

module.exports = {
  transporter : nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: config.get('nodemailerUserEmail'),
      pass: config.get('nodemailerUserPassword'),
    },
  })

}
