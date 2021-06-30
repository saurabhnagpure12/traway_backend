var express = require("express");
var router = express.Router();
var mapsController = require("../../controllers/MapsController.js");
const { check } = require("express-validator");

// middlewares
const auth = require("../../middleware/auth");

router.post(
  "/locations",
  [
    auth,
    check("location_id", "location_id is required").not().isEmpty(),
    check("location_name", "location_name is required").not().isEmpty(),
    check("location_address", "location_address is required").not().isEmpty(),
  ],
  mapsController.storeUserLocationSearch
);
router.post("/routes", auth, mapsController.storeRoute);
router.get("/routes", auth, mapsController.fetchRoutes);

module.exports = router;
