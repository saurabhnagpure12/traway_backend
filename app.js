/**
 * Required External Modules
 */

 const express = require("express");
 const path = require("path");

 var bodyParser = require('body-parser');

 // var appRouter = require('./routes/index.js');

/**
 * App Variables
 */
const app = express();
const port = process.env.PORT || "8000";

/**
 *  App Configuration
 */
 app.use(bodyParser.urlencoded({ extended: true }));
 app.use(bodyParser.json());
 app.use(express.static('public'));

/**
 * Routes Definitions
 */

 //Initial route
 app.get("/", function (req, res) {
     res.sendFile(__dirname + "/public/views/index.html");
 });

 //App api
 // app.use("/api", appRouter);

 // catch 404 and render 404 page
 app.use(function(req,res){
     res.status(404).sendFile(__dirname + "/public/views/404.html");
 });


/**
 * Server Activation
 */
 app.listen(port, () => {
  console.log("Server listening on port " + port);
});
