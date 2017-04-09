var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

//Root Route
router.get("/", function(req, res){
    res.render("landing");
});

//Show Register Form
router.get("/register", function(req, res){
    res.render("register");
});

//Signup Logic 
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome "+user.username+", you have been registered successfully.");
            res.redirect("/campgrounds");
        });
    });
});

//Show Login Form Route
router.get("/login", function(req, res){
    res.render("login");
});

//Handling Login Logic
router.post("/login", passport.authenticate("local", {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req, res){
});

//Logout Route
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success","You have been logged out successfully.");
    res.redirect("/campgrounds");
});

module.exports = router;