var Blog 	= require("../models/blog"),
	Comment = require("../models/comment");

var middlewareObj = {};

middlewareObj.checkBlogOwnership = function (req, res, next){
		if(req.isAuthenticated()){
		Blog.findById(req.params.id, function(err, foundBlog){
			if(err){
				req.flash("error", "Blog post not found.");
				res.redirect("back");
			} else {
				if(foundBlog.author.id.equals(req.user._id)){
					next();
				}else{
					req.flash("error", "Permission denied.");
					res.redirect("back");
				}
			}
		});
	} else {
		req.flash("error", "You need to be logged in to do that.");
		res.redirect("back");
	}
}

middlewareObj.checkCommentOwnership = function (req, res, next){
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id, function(err, foundComment){
			if(err){
				req.flash("error", "Comment post not found.");
				res.redirect("back");
			} else {
				if(foundComment.author.id.equals(req.user._id)){
					next();
				}else{
					req.flash("error", "Permission denied.");
					res.redirect("back");
				}
			}
		});
	} else {
		req.flash("error", "You need to be logged in to do that.");
		res.redirect("back");
	}
}

middlewareObj.isLoggedIn = function(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "You need to be logged in to do that.");
	res.redirect("/login");
}

module.exports = middlewareObj;

