var bodyParser = require("body-parser"),
	methodOverride = require("method-override"),
	expressSanitizer = require("express-sanitizer"),
	mongoose = require("mongoose"),
	express = require("express"),
	app = express();

// app config
mongoose.connect("mongodb://localhost/blog-user");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

//mongoose model config
var blogSchema = new mongoose.Schema({
	title: String,
	image: String,
	body: String,
	created: {type: Date, default: Date.now}
});
var Blog = mongoose.model("Blog", blogSchema);

app.get("/", function(req, res){
	res.redirect("/blogs");
});

// index route
app.get("/blogs", function(req, res){
	Blog.find({}, function(err, blogs){
		if(err){
			console.log("error");
		} else {
			res.render("index", {blogs: blogs});
		}
	});
});

//  new route 
app.get("/blogs/new", function(req, res){
	res.render("new");
});
//  create route
app.post("/blogs", function(req, res){
	req.body.blog.body = req.sanitize(req.body.blog.body)
	//create blog
	Blog.create(req.body.blog, function(err, newBlog){ //add mongoose model
		if(err){
			res.render("new");
		} else { 
			//redirect
			res.redirect("/blogs");
		}
	});
});

//  show route
app.get("/blogs/:id", function(req, res){
	Blog.findById(req.params.id, function(err, foundBlog){
	if(err){
		res.redirect("/blogs");
	} else {
		res.render("show", {blog: foundBlog});
	}
	});
});

//  edit route 
app.get("/blogs/:id/edit", function(req, res){
	Blog.findById(req.params.id, function(err, foundBlog){
	if(err){
	res.redirect("/blogs");
	} else {
	res.render("edit", {blog: foundBlog});
	}
	});
});

//  update route
app.put("/blogs/:id", function(req, res){
	Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
		if(err){
			res.redirect("/blogs");
		} else {
			res.redirect("/blogs/" + req.params.id);
		}
	});
});

//  delete route
app.delete("/blogs/:id", function(req,res){
	Blog.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/blogs");
		} else {
			res.redirect("/blogs");
		}
	})
});
// Blog.create({
// 	title: "Test Blog",
// 	image: "https://nodejs.org/static/images/logos/nodejs-new-pantone-black.png",
// 	body: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Vero ipsam deleniti, dicta vel fugiat commodi exercitationem tenetur fuga culpa consequatur amet, sequi esse repudiandae repellendus corrupti quisquam sint maiores aspernatur."
// });

app.listen(3000, function(){
	console.log("Server is running on port 3000 ... ");
});

