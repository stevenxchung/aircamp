var express = require("express"),
    router = express.Router({mergeParams: true}),
    Campground = require("../models/campground"),
    Comment = require("../models/comment"),
    middleware = require("../middleware");

// ===============
// COMMENTS ROUTES
// ===============

// Added isLoggedIn middleware to prevent non-users from reaching comments/new
router.get("/campgrounds/:id/comments/new", middleware.isLoggedIn, function(req, res) {
    // Find campground by ID
    Campground.findById(req.params.id, function(err, campground) {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", {campground: campground});
        }
    });
});

// Added isLoggedIn middleware to protect post route from non-users
router.post("/campgrounds/:id/comments", middleware.isLoggedIn, function(req, res) {
    // Once logged in, redirect to the campground
    // Lookup campground using ID
    Campground.findById(req.params.id, function(err, campground) {
        if (err) {
            req.flash("error", "Something went wrong");
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, function(err, comment) {
                if(err) {
                    console.log(err);
                } else {
                    // Add username, id, and user avatar to comment
                    comment.author.id = req.user._id;
                    comment.author.userDisplay = req.user.userDisplay;
                    comment.author.avatar = req.user.avatar;
                    // console.log(req.user.avatar)
                    // Save comment
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("success","Creation successful");
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
});

// Comment Edit Route
router.get("/campgrounds/:id/comments/:comment_id/edit", middleware.checkCommentOwnership, function(req, res) {
    Comment.findById(req.params.comment_id, function(err, foundComment) {
       if (err) {
           res.redirect("back");
       } else {
           res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
       }
    });
});

// Comment Update Route
router.put("/campgrounds/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// Comment Destroy Route
router.delete("/campgrounds/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res) {
    // findByIdAndRemove()
    Comment.findByIdAndRemove(req.params.comment_id, function(err) {
        if (err) {
            res.redirect("back");
        } else {
            req.flash("success","Deletion successful");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

module.exports = router;
