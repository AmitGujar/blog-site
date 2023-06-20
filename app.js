var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var express = require("express");
var expressSanitizer = require("express-sanitizer");
var methodOverride = require("method-override");
app = express();

app.set("view engine", "ejs");

app.use(methodOverride("_method"));

app.use(express.static("public"));

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(expressSanitizer());

app.listen(3000, function () {
  console.log("Server listening on port 3000");
});
// APP CONFIG
mongoose
  .connect(
    "mongodb+srv://amit:amit1234@cluster0.vco4cwh.mongodb.net/?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(function () {
    console.log("Connected to Database....");
  });
//  MONGOOSE/MODEL CONFIG
var blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created: {
    type: Date,
    default: Date.now(),
  },
});

var Blog = mongoose.model("Blog", blogSchema);

// RESTFUL ROUTES

app.get("/", function (req, res) {
  res.redirect("/blogs");
});
// index route
app.get("/blogs", function (req, res) {
  Blog.find({}, function (err, blogs) {
    if (err) {
      console.log("Error !!");
    } else {
      res.render("index", {
        blogs: blogs,
      });
    }
  });
});
// new route
app.get("/blogs/new", function (req, res) {
  res.render("new");
});
// create route
app.post("/blogs", function (req, res) {
  // create a blog in db
  req.body.blog.body = req.sanitize(req.body.blog.body);
  Blog.create(req.body.blog, function (err, newBlog) {
    if (err) {
      res.render("new");
    } else {
      // redirect to index
      console.log(req.body.blog);
      res.redirect("/blogs");
    }
  });
});
// SHOW route
app.get("/blogs/:id", function (req, res) {
  Blog.findById(req.params.id, function (err, foundBlog) {
    if (err) {
      res.redirect("/blogs");
    } else {
      res.render("show", {
        blog: foundBlog,
      });
    }
  });
});
// Edit Route
app.get("/blogs/:id/edit", function (req, res) {
  Blog.findById(req.params.id, function (err, foundBlog) {
    if (err) {
      res.redirect("/blogs");
    } else {
      res.render("edit", {
        blog: foundBlog,
      });
    }
  });
});
// update route
app.put("/blogs/:id", function (req, res) {
  req.body.blog.body = req.sanitize(req.body.blog.body);
  Blog.findByIdAndUpdate(
    req.params.id,
    req.body.blog,
    function (err, updatedBlog) {
      if (err) {
        res.redirect("/blogs");
      } else {
        res.redirect("/blogs/" + req.params.id);
      }
    }
  );
});
// Delete Route
app.delete("/blogs/:id", function (req, res) {
  // destory blog
  Blog.findByIdAndRemove(req.params.id, function (err) {
    if (err) {
      res.redirect("/blogs");
    } else {
      // redirect somewhere
      res.redirect("/blogs");
    }
  });
});
