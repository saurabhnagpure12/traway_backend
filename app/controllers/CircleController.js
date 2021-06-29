var randomstring = require("randomstring");
const Circle = require("../models/Circle");
const User = require("../models/User");

function generateCircleCode(){
  return randomstring.generate({
    length: 10,
    charset: 'alphanumeric',
    capitalization: "uppercase"
  });
}

exports.createCircle = async function (req, res) {
  try{
    const { circle_name } = req.body;
    const circleCode = generateCircleCode();
    const circle = await Circle({circle_name: circle_name,
                                circle_code: circleCode,
                                members: [{user_id: req.user.id, type: "admin"}]}).save();

    return res.status(200).json({
      status: "success",
      msg: "Circle Created",
      data: circle
    });


  }
  catch(e){
    res.status(500).json({
      data: [{ msg: "Failed creating circle" }],
    });
  }
}

exports.getCircles = async function (req, res) {
  try{
    const userId = req.user.id;

    const userCircles = await Circle.find({'members.user_id': userId});

    // userCircles.forEach((value) => {
    //   let circleMembers = value.members;
    //   circleMembers.forEach(async (val) => {
    //     let userId = val.user_id;
    //     let user = await User.findById(userId);
    //     console.log(user);
    //   });
    // })
    // return res.status(200).json({
    //   status: "success",
    //   msg: "User circles fetched",
    //   data: userCircles
    // });
    Circle.aggregate([
      {
        $project: {
          "members.user_id": {
            "$toObjectId": "members.user_id"
          }
        },
      },
      {
        $match: {
          circle_name: "Thunderbuddies"
        }
      },
      {
        $lookup: {
          from: "User",
          localField: "members.user_id",
          foreignField: "_id",
          as: "users"
        }
     }
    ],function (error, data) {

        if(error != null){
          return res.status(500).json({
            status: "failed",
            msg: error,
          });
        }
        return res.status(200).json({
          status: "success",
          msg: "User circles fetched",
          data: data
        });
      });



  }
  catch(e){
    res.status(500).json({
      data: [{ msg: "Error occurred while fetching user circles" }],
    });
  }
}

exports.deleteCircle = async function (req, res) {
  try{
    const { circle_code } = req.body;
    const userId = req.user.id;
    let circle = await Circle.find({circle_code: circle_code, 'members.user_id' : userId, 'members.type' : 'admin'});

    if(circle.length != 0){
        await Circle.deleteOne({circle_code: circle_code});

        return res
          .status(200)
          .json({ data: [{ msg: "Deleted Circle with code: " + circle_code }] });
    }
    else{
      return res
        .status(406)
        .json({ data: [{ msg: "Invalid circle_code or user not authorized to delete circle" }] });
    }

  }
  catch(e){
    console.log(e);
    res.status(500).json({
      data: [{ msg: "Error occurred" }],
    });
  }
}

exports.editCircleName = async function (req, res) {
  try{
    const { circle_code, updated_circle_name } = req.body;
    const userId = req.user.id;

    let circle = await Circle.find({circle_code: circle_code, 'members.user_id' : userId});

    if(circle.length != 0){
        await Circle.updateOne(
          { circle_code },
          {
            $set: {
               circle_name: updated_circle_name
            },
          }
        );
        return res
          .status(200)
          .json({ data: [{ msg: "Updated Circle Name" }] });
    }
    else{
      return res
        .status(406)
        .json({ data: [{ msg: "Invalid circle_code or user not authorized to update circle" }] });
    }
  }
  catch(e){
    res.status(500).json({
      data: [{ msg: "Error occurred" }],
    });
  }
}

exports.joinCircle = async function (req, res) {
  try{
    const { circle_code } = req.body;
    const userId = req.user.id;

    const circle = await Circle.findOne({circle_code: circle_code});

    let responseMsg = "";
    if(circle == null){
      responseMsg = "Invalid Circle Code";
    }

    let userExists = await Circle.find({circle_code: circle_code, 'members.user_id' : userId});

    if(userExists.length != 0){
      responseMsg = "User already a member";
    }
    else{
      if(circle.members.length >= 10){
        responseMsg = "Circle Member Limit Reached";
      }
      else{
        circle.members.push({user_id: userId, type: "member"});
        circle.save();
        responseMsg = "Joined Circle";
      }
    }

    return res.status(200).json({
      status: "success",
      msg: responseMsg
    });

  }
  catch(e){
    res.status(500).json({
      data: [{ msg: "Error occurred" }],
    });
  }
}

exports.removeMember = async function (req, res) {
  try{
    const { member_user_id, circle_code } = req.body;

    let circle = await Circle.find({circle_code: circle_code, 'members.user_id' : member_user_id});

    if(circle.length != 0){

        await Circle.updateOne( {circle_code: circle_code}, { $pullAll: {members: [{user_id : member_user_id}] } } )
        return res
          .status(200)
          .json({ data: [{ msg: "Member removed successfully from circle" }] });
    }
    else{
      return res
        .status(406)
        .json({ data: [{ msg: "Invalid circle_code or member does not exist in circle" }] });
    }
  }
  catch(e){
    console.log(e);
    res.status(500).json({
      data: [{ msg: "Error occurred" }],
    });
  }
}
