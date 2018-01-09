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
// comments edit route
router.get("/blogs/:id/comments/:comment_id/edit", function(req, res){
	Comment.findById(req.params.comment_id, function(err, foundComment){
		if(err){
			res.redirect("back");
		} else {
			res.render("comments/edit", {blog_id: req.params.id, comment: foundComment});
		}
	});
});
// comments update route
router.put("/blogs/:id/comments/:comment_id", function(req, res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
			if(err){
				res.redirect("back");
			} else {
				res.redirect("/blogs/" + req.params.id)
			}
	});
});
// comment destroy route
router.delete("/blogs/:id/comments/:comment_id", function(req, res){
	Comment.findByIdAndRemove(req.params.comment_id, function(err){
		if(err){
			res.redirect("back");
		} else {
			res.redirect("/blogs/"+req.params.id);
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