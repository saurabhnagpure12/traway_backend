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
      data: [{ msg: "Error occurred" }],
    });
  }
}

exports.getCircleInfo = async function (req, res) {
  try{

  }
  catch(e){
    res.status(500).json({
      data: [{ msg: "Error occurred" }],
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
