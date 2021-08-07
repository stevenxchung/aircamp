var express = require("express"),
    router = express.Router(),
    Campground = require("../models/campground"),
    middleware = require("../middleware"),
    User = require("../models/user");

// Show User Profile Route
router.get("/users/:id", middleware.isLoggedIn, function(req, res) {
   User.findById(req.params.id, function(err, foundUser) {
       if (err) {
           req.flash("error", "Something went wrong!");
           res.redirect("/");
       }
       Campground.find().where("author.id").equals(foundUser._id).exec(function(err, campgrounds) {
           if (err) {
               req.flash("error", "Something went wrong!");
               res.redirect("/");
           }
           res.render("users/show", {user: foundUser, campgrounds: campgrounds});
       });
   });
});

// Edit User Profile Route
router.get("/users/:id/edit", middleware.isLoggedIn, function(req, res) {
    User.findById(req.params.id, function(err, foundUser) {
        res.render("users/edit", {user: foundUser});
    });
});

// Update User Profile Route
router.put("/users/:id", middleware.isLoggedIn, function(req, res) {

    // Find and update the correct user profile
    User.findByIdAndUpdate(req.params.id, req.body.user, function(err, updatedUser) {
        if (err) {
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            req.flash("success", "Successfully Updated!");
            res.redirect("/users/" + req.params.id);
        }
    });
});

module.exports = router;
