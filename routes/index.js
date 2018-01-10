var express = require("express"),
	router	= express.Router(),
	User 	= require("../models/user")
	passport= require("passport");

router.get("/", function(req, res){
	res.redirect("/blogs");
});

//  auth routes
// show register form
router.get("/register", function(req,res){
	res.render("register");
});
// sign up logic
router.post("/register", function(req,res){
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			console.log(err);
			req.flash("error", err.message+"." );
			return res.render("register")
		}
		passport.authenticate("local")(req, res, function(){
			req.flash("success", "Your sign up was successful. Welcome "+user.username);
			res.redirect("/blogs");
		});
	});
});

// show login form
router.get("/login", function(req, res){
	res.render("login");
});

// login logic
// app.post("/login",middleware, callback)
router.post("/login", passport.authenticate("local",
	{
		successRedirect:"/blogs",
		failureRedirect:"/login"
	}), function(req, res){
});

// logout logic
router.get("/logout", function(req, res){
	req.logout();
	req.flash("success", "Your logout was successful.");
	res.redirect("/blogs");
});

function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

module.exports = router;