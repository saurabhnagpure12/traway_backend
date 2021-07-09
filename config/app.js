exports.app = {
    "jwt_secret" : process.env.JWT_SECRET,
    "mongodb" : {
      "uri" : process.env.MONGO_URI,
    },
    "nodemailer" : {
      "user_email" : process.env.NODEMAILER_USER_EMAIL,
      "user_password" : process.env.NODEMAILER_USER_PASSWORD,
    }
};
