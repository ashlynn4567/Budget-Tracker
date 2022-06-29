// imports
const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const compression = require("compression");

// establish port connection
const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/budget";
// instantiate application
const app = express();

// middleware
app.use(logger("dev"));
app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// connect application to static front end resources
app.use(express.static("public"));

// connect application to database
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useFindAndModify: false
});

// routes
app.use(require("./routes/api.js"));

// allow app to listen on port for server start
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});