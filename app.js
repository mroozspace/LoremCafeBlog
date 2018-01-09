var bodyParser 		= require("body-parser"),
	methodOverride 	= require("method-override"),
	expressSanitizer = require("express-sanitizer"),
	passport		= require("passport"),
	LocalStrategy	= require("passport-local"),
	User  			= require("./models/user"),
	mongoose 		= require("mongoose"),
	Blog 			= require("./models/blog"),
	Comment 		= require("./models/comment"),
	seedDB			= require("./seeds"),
	express 		= require("express"),
	flash			= require("connect-flash"),
	app 			= express();

var commentRoutes	= require("./routes/comments"),
	blogRoutes		= require("./routes/blogs"),
	indexRoutes		= require("./routes/index");

// app config
app.use(flash());
mongoose.connect("mongodb://localhost/blog-user");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));


// Seed database
// seedDB();

// passport config
app.use(require("express-session")({
	secret: "secret thing",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser  = req.user;
	res.locals.error		= req.flash("error");
	res.locals.success		= req.flash("success");
	next();
});

// test blog create 
// Blog.create({
// 	title: "Test Blog",
// 	image: "https://nodejs.org/static/images/logos/nodejs-new-pantone-black.png",
// 	body: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Vero ipsam deleniti, dicta vel fugiat commodi exercitationem tenetur fuga culpa consequatur amet, sequi esse repudiandae repellendus corrupti quisquam sint maiores aspernatur."
// });

app.use(indexRoutes);
app.use(commentRoutes);
app.use(blogRoutes);

app.listen(3001, function(){
	console.log("Server is running on port 3001 ... ");
});