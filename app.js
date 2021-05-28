// Dependencies
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const config = require("config");
const fileUpload = require("express-fileupload");
const app = express();

//Middlewares
app.use(express.json());
app.use(fileUpload());

// Connect to Database
mongoose
  .connect(config.get('mongoURI'), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then((res) => console.log("MongoDB Connected..."))
  .catch((err) => console.error(err));

// Home Route
app.get("/", (req, res) => {
  res.send("Working");
});

// Serving static files
app.use("/static", express.static(path.join(__dirname, "./public")));

// Load Routes
const users = require("./routes/api/users");
const auth = require("./routes/api/auth");

// Using Routes
app.use("/api/users", users);
app.use("/api/auth", auth);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server started at PORT: ${PORT}`);
});
