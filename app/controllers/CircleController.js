var randomstring = require("randomstring");
const Circle = require("../models/Circle");

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
    return res.status(200).json({
      status: "success",
      msg: "User circles fetched",
      data: userCircles
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

  }
  catch(e){
    res.status(500).json({
      data: [{ msg: "Error occurred" }],
    });
  }
}

exports.editCircleName = async function (req, res) {
  try{

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
      circle.members.push({user_id: userId, type: "member"});
      circle.save();
      responseMsg = "Joined Circle";
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

  }
  catch(e){
    res.status(500).json({
      data: [{ msg: "Error occurred" }],
    });
  }
}
