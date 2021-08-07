// All Middleware For AirCamp

var Campground = require("../models/campground"),
    Comment = require("../models/comment");

var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next) {
    // Check if user is logged in
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, function(err, foundCampground) {
            if (err) {
                req.flash("error", "Campground not found");
                res.redirect("back");
            } else {
                // Check if user owns the campground (can't do foundCampground.author.id === req.user._id, not the same type)
                // Includes admin rights logic
                if (foundCampground.author.id.equals(req.user._id) || req.user.isAdmin) {
                    // Move on to the next code in the route
                    next();
                } else {
                    req.flash("error", "You do not have permission to access that content");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "Login required to perform action");
        res.redirect("back");
    }
};

middlewareObj.checkCommentOwnership = function(req, res, next) {
    // Check if user is logged in
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function(err, foundComment) {
            if (err) {
                res.redirect("back");
            } else {
                // Check if user owns the comment
                // Includes admin rights logic
                if (foundComment.author.id.equals(req.user._id) || req.user.isAdmin) {
                    // Move on to the next code in the route
                    next();
                } else {
                    req.flash("error", "You do not have permission to access that content");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "Login required to perform action");
        res.redirect("back");
    }
};

middlewareObj.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.session.returnTo = req.url;
    req.flash("error", "Login required to perform action");
    res.redirect("/login");
};

middlewareObj.userRedirect = function complete() {
    if (options.successReturnToOrRedirect) {
        var url = options.successReturnToOrRedirect;
        if (req.session && req.session.returnTo) {
            url = req.session.returnTo;
            delete req.session.returnTo;
        }
        return res.redirect(url);
    }
    if (options.successRedirect) {
        return res.redirect(options.successRedirect);
    }
    next();
}

middlewareObj.usernameLower = function(req, res, next) {
        req.body.username = req.body.username.toLowerCase();
        next();
}

module.exports = middlewareObj;
