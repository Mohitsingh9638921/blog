var express=require("express");
var app=express();
var bodyparser=require("body-parser");
var mongoose=require("mongoose");
var methodOverride=require("method-override");
var expressSanitizer=require("express-sanitizer");

mongoose.connect("mongodb://localhost/blog456");
app.use(bodyparser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.set("view engine","ejs");
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));




var blogSchema=new mongoose.Schema({
	title:String,
	image:String,
	body:String,
	created:{type: Date,default:Date.now}
});
var blog=mongoose.model("blog",blogSchema);


app.get("/",function(req,res){
	res.redirect("/blog");
})
app.get("/blog",function(req,res){
	blog.find({},function(err,blog){
		if(!err){
                res.render("index",{blog:blog});
		}
	})
	
});
app.get("/blog/new",function(req,res){
   res.render("new");
});
app.post("/blog",function(req,res){
	req.body.blog.body=req.sanitize(req.body.blog.body);
	var newblog=req.body.blog;
	blog.create(newblog);
    res.redirect("/blog");
})


app.get("/blog/:id",function(req,res){
	blog.findById(req.params.id,function(err,foundblog){
		if(err)
		{
			console.log(err);
		}
		else
		{
			res.render("show",{blog:foundblog});
		}
	})
})
app.get("/blog/:id/edit",function(req,res){
	blog.findById(req.params.id,function(err,foundblog){
		if(err){
			console.log(err);
		}
		else
		{
			res.render("edit",{blog:foundblog});
		}
	})
})
app.put("/blog/:id",function(req,res){
	req.body.blog.body=req.sanitize(req.body.blog.body);
	blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updateBlog){
		if(!err)
		{
			res.redirect("/blog/"+req.params.id);
		}
	})
})

app.delete("/blog/:id",function(req,res){
	blog.findByIdAndRemove(req.params.id,function(err){
		if(!err){
			res.redirect("/");
		}
	})
})









app.listen(3000,function(){
	console.log("blog has been started");
})