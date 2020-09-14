const express = require("express");
const bodyParser = require("body-parser");

const mongoose = require('mongoose');

const Post = require('./models/post');

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

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});
// add posts to the db

app.post("/api/posts", (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  // console.log(post);
  post.save();
  res.status(201).json({
    message: 'Post added successfully'
  });
});

// get posts from the db
app.get("/api/posts", (req, res, next) => {
  Post.find()
    .then(documents => {
      res.status(200).json({
        message: "Posts fetched successfully!",
        posts: documents
      });

    });
  ;

});

app.delete("/api/posts/:id", (req, res, next) =>{
  console.log(req.params.id);

  // delete from mongoose modal
  Post.deleteOne({_id: req.params.id}).then(result =>{
    console.log(result);
  }).catch('error');
  res.status(200).json({
    message: 'post deleted'
  });
})

module.exports = app;
