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


// add posts to the db
app.post("/api/posts", (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  // console.log(post);
  post.save().then(result => {
    console.log('result', result);
    res.status(201).json({
      message: 'Post added successfully',
      postId: result._id
    });
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


app.get('/api/posts/:id', (req, res, next) => {
   Post.findById(req.params.id).then( post => {
     if(post){
      res.status(200).json(post);
     } else {
      res.status(404).json({message: 'Post Not Found'})
     }
   })
})

// update
app.put("/api/posts/:id", (req, res,next) => {
  const post = new Post({
    _id: req.params.id,
    title: req.body.title,
    content: req.body.content
  });

  Post.updateOne({_id: req.params.id}, post ).then( result => {
    console.log(result);
    res.status(200).json({ message: 'Update Successful'});
  })
});

app.delete("/api/posts/:id", (req, res, next) => {
  console.log(' PARAM', req.params.id);

  // delete from mongoose modal
  Post.deleteOne({_id: req.params.id}).then(result => {
    console.log(result);
  }).catch('error');

  res.status(200).json({
    message: 'post deleted'
  });
})

module.exports = app;
