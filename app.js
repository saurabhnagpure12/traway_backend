// Dependencies
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const fileUpload = require("express-fileupload");
const app = express();
require('dotenv').config();
const config = require('./config/app.js');



//Middlewares
app.use(express.json());
app.use(fileUpload());



// Connect to Database
mongoose
  .connect(config.app.mongodb.uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true,
    useCreateIndex: true
  })
  .then((res) => console.log("MongoDB Connected..."))
  .catch((err) => console.error(err));



//Initial route
app.get("/", function (req, res) {
    res.sendFile(__dirname + "/public/views/index.html");
});



// Serving static files
 app.use(express.static('public'));



// Load Routes
const appRouter = require('./app/routes/index.js');


// Using Routes
app.use("/api/v1", appRouter);




const Circle = require("./app/models/Circle");
const User = require("./app/models/User");


//------------------------------------------------------------------------------------------------------

const server = require('http').createServer(app);
const io = require('socket.io')(server);

io.on('connection', function (client) {

  console.log('client connect...', client.id);

  client.on('connect to circle', async function name(data) {
    // data = {"circle_id": "", "user_id" : "", "lat_long" : [x, y]}
    console.log('connect to circle');
    console.log(data);

    client.join(data.circle_id);
    client.circle = data.circle_id;

    let circle = await Circle.findById(client.circle).lean();

    //get circle members location
    circle.members.forEach((member) =>{

      if(member.user_id != data.user_id){

        console.log("yes");
        io.emit('request member to join room', {
          "circle_id" : client.circle,
          "user_id" : member.user_id
        });

      }
      else{
        console.log("no");
      }

    });

  })

  client.on('join room', function name(data) {
    console.log('join room');
    console.log(data);
    client.join(data.circle_id);
    io.emit('mark member location', data);
  })

  client.on('update location', function name(data) {
    console.log('update location');
    console.log(data);
    client.to(client.circle).emit('mark member location', {
      "user_id" : data.user_id,
      "user_name" : data.user_name,
      "lat_long" : data.lat_long,
      "circle_id" : client.circle
    });
  })


  client.on('disconnect', function () {
    console.log('client disconnect...', client.id)
    // handleDisconnect()
  })

  client.on('error', function (err) {
    console.log('received error from client:', client.id)
    console.log(err)
  })
})

const PORT = process.env.PORT || 5000;

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server started at PORT: ${PORT}`);
});
