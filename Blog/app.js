var express 		 = require("express"),
	methodOverride   = require("method-override"),
	expressSanitizer = require("express-sanitizer"),
	app 			 = express(),
	bodyParser  	 = require("body-parser");

// app config
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/restful_blog_app", {
	useNewUrlParser: true,
	useUnifiedTopology: true
})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

// mongoose/model config
var blogSchema = new mongoose.Schema({
	title: String,
	image: String,
	body: String,
	created: {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);

// Blog.create({
// 	title: "Test Blog",
// 	image: "https://www.rover.com/blog/wp-content/uploads/2019/11/pomsky-puppy-flickr.jpg",
// 	body: "Hello, this is a dog post!"
// });

// restful routes

app.get("/", function(req, res){
	res.redirect("/blogs");
});

// INDEX ROUTE
app.get("/blogs", function (req, res){
	Blog.find({}, function(err, blogs){
		if(err){
			console.log("Error");
		} else {
			res.render("index", {blogs: blogs});
		}
	});
});

// new route
app.get("/blogs/new", function(req, res){
	res.render("new");
});

//create route
app.post("/blogs", function(req, res){
	//create blogs
	console.log(req.body);
	console.log("===========")
	console.log(req.body);
	Blog.create(req.body.blog, function(err, newBlog){
		if(err){
			res.render("new");
		} else {
			res.redirect("/blogs");
		}
	});
});

// Show route
app.get("/blogs/:id", function(req, res){
	Blog.findById(req.params.id, function(err, foundBlog){
		if(err){
			res.redirect("/blogs");
		} else {
			res.render("show", {blog: foundBlog});
		}
	});
});

//Edit route
app.get("/blogs/:id/edit", function(req, res){
	Blog.findById(req.params.id, function(err, foundBlog){
		if(err){
			res.redirect("/blogs");
		} else {
			res.render("edit", {blog: foundBlog});
		}
	});
});

// Update Route
app.put("/blogs/:id", function(req, res){
	req.body.blog.body = req.sanitize(req.body.blog.body);
	Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
		if(err){
			res.redirect("/blogs");
		} else {
			res.redirect("/blogs/" + req.params.id);
		}
	})
});

// Destroy Route
app.delete("/blogs/:id", function(req, res){
	// destroy blog
	Blog.findByIdAndRemove(req.params.id, function(err){
		if(err) {
			res.redirect("/blogs");
		} else {
			res.redirect("/blogs");
		}
	});
});

app.listen(3000, function() { 
  console.log('Server listening on port 3000'); 
});