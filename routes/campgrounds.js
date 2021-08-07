var express = require("express"),
    router = express.Router(),
    Campground = require("../models/campground"),
    middleware = require("../middleware"),
    NodeGeocoder = require('node-geocoder');

// Link to Google API
// For more info on NodeGeocoder() visit https://www.npmjs.com/package/node-geocoder
var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};

var geocoder = NodeGeocoder(options);

// INDEX - render campgrounds page on request
router.get("/campgrounds", function(req, res) {
    // Get all campgrounds from database
    Campground.find({}, function(err, allCampgrounds) {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds: allCampgrounds, page: "campgrounds"});
        }
    });
});

// CREATE - route to create a new campground
router.post("/campgrounds", middleware.isLoggedIn, function(req, res) {
    // Get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var price = req.body.price;
    var des = req.body.description;
    var author = {
        id: req.user._id,
        userDisplay: req.user.userDisplay
    };

    // If there is not an error and the address has a length, apply lat, lng, and location to newCampground and redirect to campgrounds page
    geocoder.geocode(req.body.location, function(err, data) {
        if (err || !data.length) {
            req.flash("error", "Must be a valid location!");
            return res.redirect("back");
        }
        var lat = data[0].latitude,
            lng = data[0].longitude,
            location = data[0].formattedAddress;

        // These variables will be routed to the new campground views using Embedded JavaScript or ejs
        var newCampground = {name: name, image: image, price: price, description: des, author: author, location: location, lat: lat, lng: lng};
        // Create a new campground and save to database
        Campground.create(newCampground, function(err, newlyCreated) {
            if (err) {
                console.log(err);
            } else {
                // Redirect back to campgrounds page (via router.get("/") request) after user submits information
                console.log(newlyCreated);
                res.redirect("/campgrounds");
            }
        });
    });
});

// NEW - show the form to send data to the campground post route above
router.get("/campgrounds/new", middleware.isLoggedIn, function(req, res) {
    res.render("campgrounds/new");
});

// SHOW - show a detailed page of a campground when a specific campground is clicked (must go after NEW route or "/:id" will ignore "/new")
router.get("/campgrounds/:id", function(req, res) {
    // Find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
        if (err) {
            console.log(err);
        } else {
            // console.log(foundCampground);
            // Render the show page template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

// Edit Campgound Route
router.get("/campgrounds/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground) {
        res.render("campgrounds/edit", {campground: foundCampground});
    });
});

// Update Campground Route
router.put("/campgrounds/:id", middleware.checkCampgroundOwnership, function(req, res) {

    // If there is not an error and the address has a length, apply lat, lng, and location to replace the current variables stored within req.body.campground
    geocoder.geocode(req.body.location, function(err, data) {
        if (err || !data.length) {
            req.flash("error", "Invalid address!");
            return res.redirect("back");
        }
        req.body.campground.lat = data[0].latitude,
        req.body.campground.lng = data[0].longitude,
        req.body.campground.location = data[0].formattedAddress;

        // Find and update the correct campground
        Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground) {
            if (err) {
                req.flash("error", err.message);
                res.redirect("back");
            } else {
                req.flash("success", "Successfully Updated!");
                res.redirect("/campgrounds/" + req.params.id);
            }
        });
    });
});

// Destroy Campground Route
router.delete("/campgrounds/:id", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;
