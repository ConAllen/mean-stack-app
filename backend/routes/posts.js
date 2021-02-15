const express = require('express');
const router = express.Router();
const Post = require('../models/post');

const multer = require("multer");

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
};
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }
    cb(error, "backend/images")
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext);
  }
});
// add posts to the db
router.post("", multer({ storage: storage }).single("image"), (req, res, next) => {

  const url = req.protocol + '://' + req.get("host");

  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename
  });
  // console.log(post);
  post.save().then(createdPost => {
    console.log('createdPost', createdPost);
    res.status(201).json({
      message: 'Post added successfully',
      post: {
        ...createdPost,
        id: createdPost._id,

      }

    });
  });
});

// get posts from the db
router.get("", (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPosts;
  if (pageSize && currentPage) {
    postQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize)
  }
  postQuery
    .then(documents => {
      console.log('doc', documents)
      fetchedPosts = documents;
      return Post.count();
    }).then(count => {
      console.log(count)
      res.status(200).json({
        message: "Posts fetched successfully!",
        posts: fetchedPosts,
        maxPosts: count
      });
    })
    ;

});


router.get('/:id', (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: 'Post Not Found' })
    }
  })
})

// update
router.put("/:id", multer({ storage: storage }).single("image"), (req, res, next) => {
  console.log(req.file);
  let imagePath = req.body.imagePath;

  if (req.file) {
    const url = req.protocol + '://' + req.get("host");
    imagePath = url + "/images/" + req.file.filename
  }
  const post = new Post({
    _id: req.params.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath
  });
  console.log('post obj', post);

  Post.updateOne({ _id: req.params.id }, post).then(result => {
    console.log(result);
    res.status(200).json({ message: 'Update Successful' });
  })
});

router.delete("/:id", (req, res, next) => {
  console.log(' PARAM', req.params.id);

  // delete from mongoose modal
  Post.deleteOne({ _id: req.params.id }).then(result => {
    console.log(result);
  }).catch('error');

  res.status(200).json({
    message: 'post deleted'
  });
})

module.exports = router;
