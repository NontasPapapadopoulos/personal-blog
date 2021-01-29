//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/blogDB", { useNewUrlParser: true });

const postSchema = {
  name: String,
  content: String
};

const Post = mongoose.model("Post", postSchema);


const homeStartingContent = "Welcome to my blog ";

const app = express();



app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function (req, res) {
  Post.find({}, function (err, posts) {
    res.render("home", { title: "Home", startingContent: homeStartingContent, posts: posts });
  });


});

app.get("/about", function (req, res) {
  res.render("about", { title: "About" });
});

app.get("/contact", function (req, res) {
  res.render("contact", { title: "Contact" });
});

app.get("/compose", function (req, res) {
  res.render("compose", { title: "Compose" });
});


app.post("/compose", function (req, res) {
  const post = new Post({
    name: req.body.postTitle,
    content: req.body.postText
  });
  post.save(function (err) {
    if (!err) {
      res.redirect("/");
    }
  });
});


app.get("/posts/:postId", function (req, res) {
  const requestedPostId = req.params.postId;

  Post.findOne({ _id: requestedPostId }, function (err, post) {
    res.render("post", { title: post.title, content: post.content });
  });
});



app.listen(3000, function () {
  console.log("Server started on port 3000");
});
