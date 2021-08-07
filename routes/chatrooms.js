var express = require("express"),
    router = express.Router(),
    passport = require("passport"),
    middleware = require("../middleware"),
    // Room = require("../models/room"),
    User = require("../models/user");

// Render chatroom
router.get("/chatroom", middleware.isLoggedIn, function(req, res) {
  res.render("chatroom");
});

module.exports = router;
