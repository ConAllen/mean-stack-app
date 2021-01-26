const express = require("express");
const bodyParser = require("body-parser");

const mongoose = require('mongoose');

const postsRoutes = require("./routes/posts");
const app = express();

mongoose.connect('mongodb+srv://con:OrW5L8JvKQwTvjFi@post-board-app.xrln3.mongodb.net/Post-Board-App?retryWrites=true&w=majority')
  .then(() => {
    console.log('Connected to DB');
  })
  .catch(() => {
    console.log('Connection failed');
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


// coors
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});


app.use("/api/posts", postsRoutes);
module.exports = app;
