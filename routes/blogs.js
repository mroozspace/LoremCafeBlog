var express = require("express"),
	router	= express.Router(),
	middleware = require("../middleware");

var Blog 	= require("../models/blog");

// index route
router.get("/blogs", function(req, res){
	Blog.find({}, function(err, blogs){
		if(err){
			console.log("error");
		} else {
			res.render("blogs/index", {blogs: blogs, currentUser : req.user});
		}
	});
});

//  new route 
router.get("/blogs/new", middleware.isLoggedIn, function(req, res){
	res.render("blogs/new");
});
//  create route
router.post("/blogs", function(req, res){

	req.body.blog.body = req.sanitize(req.body.blog.body);

	//create blog
	Blog.create(req.body.blog, function(err, newBlog){ 
	//add mongoose model
		if(err){
			res.render("blogs/new");
		} else { 
			newBlog.author.id = req.user._id;
			newBlog.author.username = req.user.username;	
			newBlog.save();		
			//redirect
			res.redirect("/blogs");
		}
		console.log(req.user.username);
	});
});

//  show route
router.get("/blogs/:id", function(req, res){
	Blog.findById(req.params.id).populate("comments").exec( function(err, foundBlog){
	if(err){
		res.redirect("/blogs");
	} else {
		res.render("blogs/show", {blog: foundBlog});
	}
	});
});

//  edit route 
router.get("/blogs/:id/edit", middleware.checkBlogOwnership, function(req, res){
	Blog.findById(req.params.id, function(err, foundBlog){
		res.render("blogs/edit", {blog: foundBlog});
	});
});

//  update route
router.put("/blogs/:id", middleware.checkBlogOwnership, function(req, res){
	Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
		if(err){
			res.redirect("/blogs");
		} else {
			if(updatedBlog.author.id )
			res.redirect("/blogs/" + req.params.id);
		}
	});
});

//  delete route
router.delete("/blogs/:id", middleware.checkBlogOwnership, function(req,res){
	Blog.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/blogs");
		} else {
			req.flash("success", "Blog post deleted.");
			res.redirect("/blogs");
		}
	})
});

// function isLoggedIn(req, res, next){
// 	if(req.isAuthenticated()){
// 		return next();
// 	}
// 	res.redirect("/login");
// }

// function checkBlogOwnership(req, res, next){
// 		if(req.isAuthenticated()){
// 		Blog.findById(req.params.id, function(err, foundBlog){
// 			if(err){
// 				res.redirect("back");
// 			} else {
// 				if(foundBlog.author.id.equals(req.user._id)){
// 					next();
// 				}else{
// 					res.redirect("back");
// 				}
// 			}
// 		});
// 	} else {
// 		res.redirect("back");
// 	}
// };


module.exports = router;