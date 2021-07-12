// Load Models
const UserSearchedLoactions = require("../models/UserLocationSearch");
const UserRoute = require("../models/UserRoute");
const User = require("../models/User");
const { validationResult } = require("express-validator");

//Save recent user location searches
exports.storeUserLocationSearch = async function (req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { location_id, location_name, location_address } = req.body;
    const checkUser = await User.findById(req.user.id);
    if (!checkUser) {
      return res.status(400).json({ data: [{ msg: "User Does Not Exist" }] });
    }
    const user = await UserSearchedLoactions.findOne({ user_id: req.user.id });
    // if user has has no locations till this point create new one
    if (!user) {
      const createdUserLocations = await new UserSearchedLoactions({
        user_id: req.user.id,
        recent_search_locations: [
          {
            location_id,
            location_name,
            location_address,
          },
        ],
      }).save();
      return res
        .status(200)
        .json({ data: { msg: "Location Created Successfully" } });
    } else {
      // Grab all previous locations
      const locations = user.recent_search_locations;
      // check and delete if location exist
      locations.forEach((location, index) => {
        if (location && location.location_id === location_id) {
          locations.splice(index, 1);
        }
        return location;
      });
      // enQueue the current location
      locations.unshift({
        location_id,
        location_name,
        location_address,
      });
      // check if you have more than 5 locations
      if (locations.length > 5) {
        // Delete all elements from 5 to arrayLength
        locations.splice(5);
      }
      // Update User Locations
      await UserSearchedLoactions.updateOne(
        { _id: user._id },
        {
          $set: {
            recent_search_locations: locations,
          },
        }
      );
    }
    return res
      .status(200)
      .json({ data: [{ msg: "Location Updated Successfully" }] });
  } catch (err) {
    res.status(500).json({
      data: [{ msg: "Error occurred" }],
    });
  }
};

//Store searched route data i.e. start & end locations
// TODO: @nitish check this: I assume this route has access only to admin if yes we need to add middleware
exports.storeRoute = async function (req, res) {
  try {
    // TODO: Add Validations for post data
    /*
      Assumption:
      1. start is object containing { lat: "", long: "" }
      2. Similarly: end is object containing { lat: "", long: "" }

      Ex: {
            "start" : {
                  "lat" : "55.3",
                  "long" : "66.7"
            },
            "end" : {
                  "lat" : "55.3",
                  "long" : "66.7"
            }
          }
    */
    const checkUser = await User.findById(req.user.id);
    if (!checkUser) {
      return res.status(400).json({ data: [{ msg: "User Does Not Exist" }] });
    }
    const { start, end } = req.body;
    // Since the document is returned holding into variable there is no other purpose or no usage of it in further code
    const savedLocation = await new UserRoute({
      user_id: req.user.id,
      start,
      end,
    }).save();
    return res
      .status(200)
      .json({ data: [{ msg: "User Route Added Successfully" }] });
  } catch (err) {
    return res.status(500).json({
      data: [{ msg: "Error occurred" }],
    });
  }
};

exports.fetchRoutes = async function (req, res) {
  try {
    // Fetch current users recent locations
    const UserRecentLocations = await UserSearchedLoactions.findOne({
      user_id: req.user.id,
    });
    // Check if there are any locations
    if (UserRecentLocations)
      return res
        .status(200)
        .json({ data: UserRecentLocations.recent_search_locations });
    return res
      .status(200)
      .json({ data: [{ msg: "User has No Searched Locations" }] });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({
      data: [{ msg: "Error occurred" }],
    });
  }
};
