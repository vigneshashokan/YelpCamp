var express = require("express");
var router = express.Router();
var middleware = require("../middleware");
var Campground = require("../models/campgrounds");

//==================================
//CAMPGROUND ROUTES
//==================================

//INDEX - Shows all campgrounds
router.get("/", function(req, res){
    Campground.find({}, function(err, campgrounds){
        if(err){
            console.log("Error in retrieving campgrounds");
        } else {
            res.render("campgrounds/index",{campgrounds:campgrounds});
        }
    });
});

//CREATE - Add new campgrounds
router.post("/", middleware.isLoggedIn, function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var price = req.body.price;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampGround = {name:name, price:price, image:image, description:desc, author:author};
    
    Campground.create(newCampGround, function(err, newCamp){
        if(err){
            console.log("camp not saved");
        } else {
            res.redirect("/campgrounds");
        }
    })
});

//NEW - Show form to create new campgrounds
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new");
});

//SHOW - Shows more information about one campground
router.get("/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCamp){
        if(err){
            console.log("error!");
        } else {
            res.render("campgrounds/show",{campground:foundCamp});
        }
    });
});

//Edit Campground Route
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err) {
            res.redirect("back");
        } else {
            res.render("campgrounds/edit", {campground:foundCampground});
        }
    });
});

//Update Campground Route
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err) {
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + updatedCampground._id);
        }
    });
});

//Destroy Campground Route
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err) {
            res.redirect("back");
        } else {
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;
