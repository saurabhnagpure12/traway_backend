// Load Models
const UserSearchedLoactions = require("../models/UserLocationSearch");
const UserLocation = require("../models/UserLocation");

//Save recent user location searches
exports.storeUserLocationSearch = async function (req, res) {
  try {
    // TODO: Add Validations for post data
    const { lat, long } = req.body;
    const user = await UserSearchedLoactions.findOne({ user_id: req.user.id });
    // if user has has no locations till this point create new one
    if (!user) {
      const createdUserLocations = await new UserSearchedLoactions({
        user_id: req.user.id,
        recent_search_locations: [{ lat, long }],
      }).save();
      return res.status(200).json({ data: {'msg' : 'Location Created Successfully'}});
    } 
    else {
      // Grab all previous locations
      const locations = user.recent_search_locations;
      // enQueue the current location
      locations.unshift({ lat, long });
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
    return res.status(200).json({ data: [{'msg' : 'Location Updated Successfully'}]});
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
    const { start, end } = req.body;
    // Since the document is returned holding into variable there is no other purpose or no usage of it in further code
    const savedLocation = await new UserLocation({user_id: req.user.id,start, end }).save();
    return res.status(200).json({ data: [{ 'msg' : 'User Locations Added SuccessFully' }]})
  } catch (err) {
    return res.status(500).json({
      data: [{ msg : "Error occurred"}],
    });
  }
};
