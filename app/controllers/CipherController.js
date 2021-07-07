const mongoose = require("mongoose");
var randomstring = require("randomstring");
const Cipher = require("../models/Cipher");
const User = require("../models/User");

function generateCipherCode() {
  return randomstring.generate({
    length: 10,
    charset: "alphanumeric",
    capitalization: "uppercase",
  });
}

exports.createCipher = async function (req, res) {
  try {
    const { lat_long, place_details, place_area,
			place_state, place_city, place_pincode, place_category } = req.body;

    const cipher_code = generateCipherCode();
	  let cipher = await Cipher({
        cipher_code, lat_long, place_details, place_area,
  			place_state, place_city, place_pincode, place_category
      }).save();

	let user = await User.findById(req.user.id);
	user.ciphers.push(cipher._id);
	await user.save();

    return res.status(200).json({
      status: "success",
      msg: "Cipher Created",
      cipher_code: cipher_code
    });
  } catch (e) {
	  console.log(e);
    res.status(500).json({
      data: [{ msg: "Failed creating cipher" }],
    });
  }
};



exports.getCiphers = async function (req, res) {
  try {
    let user = await User.findById(req.user.id);
	let ciphers = [];

	for(let i=0; i< user.ciphers.length; i++){
		let cipher = await Cipher.findById(user.ciphers[i]);
		ciphers.push(cipher);
	}

	return res.status(200).json({
      status: "success",
      msg: "Cipher Fetched",
	  data: ciphers
    });

  } catch (e) {
    console.log(e);
    res.status(500).json({
      data: [{ msg: "Error occurred while fetching user ciphers" }],
    });
  }
};



exports.deleteCipher = async function (req, res) {
  try {
    const { cipher_code } = req.body;
    const userId = req.user.id;
    let cipher = await Cipher.findOne({
      cipher_code: cipher_code
    });

    if (cipher.length != 0) {
	     await User.findByIdAndUpdate( userId, { $pullAll: {ciphers: [cipher._id] } } );
       await Cipher.deleteOne({ cipher_code: cipher_code });

      return res
        .status(200)
        .json({ data: [{ msg: "Deleted Cipher with code: " + cipher_code }] });
    } else {
      return res.status(406).json({
        data: [
          {
            msg: "Invalid cipher_code",
          },
        ],
      });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({
      data: [{ msg: "Error occurred while deleting cipher" }],
    });
  }
};

exports.updateCipher = async function (req, res) {
  try {
    const { cipher_code, lat_long, place_details, place_area,
			place_state, place_city, place_pincode, place_category } = req.body;
    const userId = req.user.id;

	let cipher = await Cipher.find({
      cipher_code: cipher_code
    });

    if (cipher.length != 0) {
      await Cipher.updateOne(
        { cipher_code },
        {
          $set: {
            cipher_code, lat_long, place_details, place_area,
			place_state, place_city, place_pincode, place_category
          },
        }
      );
      return res.status(200).json({ data: [{ msg: "Updated Cipher" }] });
    } else {
      return res.status(406).json({
        data: [
          {
            msg: "Invalid cipher_code",
          },
        ],
      });
    }

  } catch (e) {
	  console.log(e);
    res.status(500).json({
      data: [{ msg: "Error occurred while updating cipher" }],
    });
  }
};
