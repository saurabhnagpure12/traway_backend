// Load Models
const User = require("../models/User");
const { validationResult } = require("express-validator");
const fs = require('fs');
const AWS = require('aws-sdk');
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});


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


exports.updateProfileImage = async function (req, res) {
  try {

    const userId = req.user.id;

    let file = req.files.profile_image;

    let ext = file.name.split(".");
    ext = "."+ext[ext.length-1];

    const params = {
       Bucket: 'traway-backend-bucket',
       Key: 'profile_images/'+userId+ext,
       Body: file.data
    };

    s3.upload(params, async function(err, data) {

     if(err){
       throw err;
     }

     await User.updateOne(
       { _id: userId },
       {
         $set: {
            profile_image : data.Location
         },
       }
     );

     return res.status(200).json({ data: [{ msg: "Profile Image Updated", 'profile_image' : data.Location }] });
    });

  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ errors: [{ msg: "Error Occurred while uploading profile image" }] });
  }
};



exports.removeProfileImage = async function(req, res){
  try{

    const userId = req.user.id;

    const user = await User.findById(userId);

    let ext = user.profile_image.split(".");
    ext = "."+ext[ext.length-1];

    const params = {
       Bucket: 'ermin-traway-backend',
       Key: 'profile_images/'+userId+ext
    };

    s3.deleteObject(params, async function(err, data) {
      if(err){
        throw err;
      }

      await User.updateOne(
        { _id: userId },
        {
          $set: {
             profile_image : ""
          },
        }
      );

      return res.status(200).json({ data: [{ msg: "Profile Image Removed" }] });
    });

  }
  catch (err) {
    console.log(err.message);
    return res.status(500).json({ errors: [{ msg: "Error Occurred while removing profile image" }] });
  }
}



exports.updateLastSeenLatLong = async function(req, res) {
  try{
    const userId = req.user.id;
    const { last_seen_latlong } = req.body;
    const user= await User.findById(userId);
    if(!user){
      return res.status(400).json({ errors: [{ msg: "User Does Not Exist" }] });
    }
    await User.updateOne(
      { _id: userId },
      {
        $set: {
           last_seen : {
             latlong : last_seen_latlong,
             date_time : Date.now()
           }
        },
      }
    );
    return res
      .status(200)
      .json({ data: [{ msg: "User Last Seen Location updated" }] });
  }
  catch (err) {
    console.log(err.message);
    return res.status(500).json({ errors: [{ msg: "Error Occurred while updating user last seen" }] });
  }
}
