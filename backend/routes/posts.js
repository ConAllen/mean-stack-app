const express = require('express');
const router = express.Router();
const Post = require('../models/post');





// add posts to the db
router.post("", (req, res, next) => {
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
router.get("", (req, res, next) => {
  Post.find()
    .then(documents => {
      res.status(200).json({
        message: "Posts fetched successfully!",
        posts: documents
      });

    });
  ;

});


router.get('/:id', (req, res, next) => {
   Post.findById(req.params.id).then( post => {
     if(post){
      res.status(200).json(post);
     } else {
      res.status(404).json({message: 'Post Not Found'})
     }
   })
})

// update
router.put("/:id", (req, res,next) => {
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

router.delete("/:id", (req, res, next) => {
  console.log(' PARAM', req.params.id);

  // delete from mongoose modal
  Post.deleteOne({_id: req.params.id}).then(result => {
    console.log(result);
  }).catch('error');

  res.status(200).json({
    message: 'post deleted'
  });
})

module.exports = router;
