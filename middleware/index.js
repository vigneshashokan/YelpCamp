var Campground = require("../models/campgrounds");
var Comment = require("../models/comments");
var middlewareObject = {};

middlewareObject.checkCampgroundOwnership = function(req, res, next) {
    if(req.isAuthenticated()) {
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err){
                req.flash("error", "Campground not found!");
                res.redirect("back");
            } else {
                if(foundCampground.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to edit this campground.");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "Please login to perform the action");
        res.redirect("/login");
    }
}

middlewareObject.checkCommentOwnership = function(req, res, next) {
    if(req.isAuthenticated()) {
        Comment.findById(req.params.comments_id, function(err, foundComment){
            if(err){
                res.redirect("back");
            } else {
                if(foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to edit this comment.");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "Please login to perform the action");
        res.redirect("/login");
    }
}

middlewareObject.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Please login to perform the action.");
    res.redirect("/login");
}

module.exports = middlewareObject;