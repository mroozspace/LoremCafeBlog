var mongoose = require("mongoose"),
	Blog	 = require("./models/blog"),
	Comment  = require("./models/comment");

var data	 = [
				{
				 	title: "js post",
					image: "https://d301sr5gafysq2.cloudfront.net/bb3ccccd4cf0/img/repo-avatars/js.svg",
				 	body: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sed dolor, odit corrupti sequi ut consequatur dolores voluptatem. Sequi doloribus voluptatem quos laudantium debitis dignissimos quae, ipsam blanditiis nam incidunt dolorum beatae quod perferendis sit pariatur optio et, reiciendis iure rem voluptates, tenetur excepturi reprehenderit ex commodi harum. Doloremque, harum, maxime."
				},
				{
					title: "HTML post",
					image: "https://www.html5rocks.com/static/demos/svgmobile_fundamentals/images/html5-2048x1536.png",
					body: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Earum pariatur repellat illum cumque a veritatis et dolorum voluptas magni delectus laboriosam dolorem ipsam sed harum, sit ullam perferendis eius accusantium qui. Officiis nisi voluptates quibusdam similique earum repellendus ut, corporis, dicta, ipsa expedita nam pariatur. Architecto cupiditate libero incidunt nisi!"
				},
				{
					title: "CSS post",
					image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/CSS.3.svg/730px-CSS.3.svg.png",
					body: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. At eaque omnis quibusdam nihil, adipisci et. Veniam similique, velit animi consequatur nesciunt deserunt consequuntur voluptatem explicabo nisi labore atque recusandae ducimus harum rerum vero, dolorem quisquam, commodi sint tenetur nulla deleniti. Debitis magnam sint ipsam, assumenda earum vel accusamus. Atque soluta vitae aspernatur perferendis inventore a officiis reprehenderit esse illum. Dolorem."
				}
			   ];

function seedDB(){
	// remove blog posts
	Blog.remove({}, function(err){
		if(err){
			console.log(err);
		}
		console.log("removed Blogs");
		
		// add blog posts
		data.forEach(function(seed){
			Blog.create((seed), function(err, blog){
				if(err){
					console.log(err)
				} else{
					console.log("Blog post - "+blog.title+"- added");
					// add comments
					Comment.create({
						text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dicta distinctio quasi dolores nobis vero, libero provident sed quo obcaecati adipisci.",
						author: "user3122"
					}, function(err, comment){
						if(err){
							console.log(err);
						} else{
							blog.comments.push(comment);
							blog.save();
							console.log("comment added");
						}						
					})
				}
			});
		});
	});	
};

module.exports = seedDB;