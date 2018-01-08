var express = require("express"),
	router	= express.Router();

var Blog 	= require("../models/blog"),
	Comment = require("../models/comment");

// comment routes
router.get("/blogs/:id/comments/new", isLoggedIn,function(req, res){
	// find blog by id 
	Blog.findById(req.params.id, function(err, blog){
		if(err){
			console.log(err);
		} else{
			res.render("comments/new", {blog: blog});
		}
	});
});

router.post("/blogs/:id/comments", isLoggedIn,function(req, res){
	Blog.findById(req.params.id, function(err, blog){
		if(err){
			console.log(err);
			res.redirect("/blogs");
		} else {			
			Comment.create(req.body.comment, function(err, comment){
				if(err){
					console.log(err);
				} else {
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
					// save comment
					blog.comments.push(comment);
					blog.save();
					res.redirect("/blogs/"+blog._id);
				}
			});
		}
	});
});

// middleware
function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

module.exports = router;