var  express     = require("express"),
     app         = express(),
methodOverride   = require("method-override"),
expressSanitizer =require("express-sanitizer"),
     bodyParser  = require("body-parser"),
     mongoose    = require("mongoose");
     
     mongoose.connect("mongodb://localhost/restful_blog_app");
     app.set("view engine", "ejs");
     app.use(express.static("public"));
     app.use(methodOverride("_method"));
     app.use(bodyParser.urlencoded({extended:true}));
     app.use(expressSanitizer());
     var blogSchema = new mongoose.Schema({
         title:String,
         image:String,
         body: String,
         created:{type:Date, default:Date.now}
     });
     
     var Blog = mongoose.model("Blog",blogSchema);
    
     
     app.get("/",function(req,res){
         res.redirect("/blogs");
     });
     app.get("/blogs",function(req,res){
         Blog.find({}, function(err, blogs){
             if(err){
                  console.log(err);} else{
                  res.render("index", {blogs: blogs});}
              
         });
         });
     app.get("/blogs/new",function(req, res) {
         res.render("new");
     });
     app.post("/blogs",function(req,res) {
          req.body.blogs.body = req.sanitize(req.body.blogs.body);
          Blog.create(req.body.blogs, function(err, newBlog){
               if(err){
                    res.render("new");} else {
                    res.redirect("/blogs");}
          });
     });
     app.get("/blogs/:id",function(req, res) {
          Blog.findById(req.params.id, function(err,foundBlog){
               if(err){
                    res.redirect("/blogs");}else{
                    res.render("show",{blogs: foundBlog});
               } });
          });
     app.get("/blogs/:id/edit", function(req, res) {
               
             Blog.findById(req.params.id, function(err,foundBlog){
               if(err){
                    res.redirect("/blogs");}else{
                    res.render("edit",{blogs : foundBlog});
               } });
          });
     
     app.put("/blogs/:id", function(req,res){
          Blog.findByIdAndUpdate(req.params.id, req.body.blogs, function(err,updatedBlog){
               if(err){res.redirect("/blogs");}else{
                    res.redirect("/blogs/ "+ req.params.id);
               }
          }); 
     });
     
     app.delete("/blogs/:id",function(req,res){
          Blog.findByIdAndRemove(req.params.id, function(err){
               if(err){
                    res.redirect("/blogs");} else{
                    res.redirect("/blogs");}
               });
          });
               
     app.listen(process.env.PORT,process.env.IP,function(){
         console.log("server is running");
     });