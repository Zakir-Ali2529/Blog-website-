//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose= new require("mongoose")


const homeStartingContent = "It is a blog website where you can write your daily journal.";
const aboutContent = "I am a hard-worker with a can-do attitude. I want to work with a team from which I can learn a lot & can also help them. I am passionate about my work.";
const contactContent = "**************************************************************************************";

mongoose.connect("mongodb://localhost:27017/blogDB", { useNewUrlParser: true } )

const postSchema= {
  title: String,
  content: String
}

const Post = mongoose.model("Post", postSchema);
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// let posts = [];

app.get("/", function(req, res){
  Post.find({},function(err,posts){
    // console.log(posts);
    
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
      });
  })
  
});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  console.log(req.body);
  

  const post= new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  })
  /*
  post.save()
  res.redirect("/")
  */
 // to fix BUG
  post.save(function(err){
    if(!err){
      res.redirect("/");
    }
  });

  

});

app.get("/posts/:postID", function(req, res){
  const requestedID = req.params.postID;
  
  Post.findOne({_id:requestedID}, function(err,post){
    if(!err){
      console.log("Match found!");      
      res.render("post",{
        title:post.title,
        content: post.content
      })
    }
  });

  // Post.forEach(function(post){
  //   const storedTitle = _.lowerCase(post.title);

  //   if (storedTitle === requestedTitle) {
  //     res.render("post", {
  //       title: post.title,
  //       content: post.content
  //     });
  //   }
  // });

});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
