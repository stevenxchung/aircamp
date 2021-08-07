// Allows us to use Google Maps API
require("dotenv").config();

// Initialize express, bodyParser, and mongoose to use in our app
var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    flash = require("connect-flash"),
    passport = require("passport"),
    http = require("http"),
    server = http.createServer(app),
    io = require("socket.io").listen(server),
    methodOverride = require("method-override"),
    LocalStrategy = require("passport-local"),
    Campground = require("./models/campground"),
    Comment = require("./models/comment"),
    User = require("./models/user"),
    seedDB = require("./seeds");

// Require files from /routes to route code into app.js
var commentRoutes = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    chatroomRoutes = require("./routes/chatrooms"),
    userRoutes = require("./routes/users"),
    indexRoutes = require("./routes/index");

// If something goes wrong we want to set the environment variable to a default path
var url = process.env.dburl || "mongodb://localhost/aircamp";
// Check for errors if any
console.log(url);

// Adding moment since action to our app
app.locals.moment = require('moment');

// Standard format to use the above tools in this application
mongoose.connect(url);
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(flash());

// Folder referencing for CSS and JS
app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/scripts"));

// Seeding the database to add campgrounds and comments
// seedDB();

// Passport Configurations
app.use(require("express-session")({
    secret: "Knock knock",
    resave: false,
    saveUninitialize: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Make currentUser available to every route
app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    // Move on to the next line of code wherever this function is placed
    next();
});

// Import routes (used to have url shortcuts here in the first argument
// but it would mess with the url redirect so they were removed)
app.use(commentRoutes);
app.use(campgroundRoutes);
app.use(userRoutes);
app.use(chatroomRoutes);
app.use(indexRoutes);

// ======================
// CHATROOM
// ======================

var users = [];
var connections = [];

// Establish connection
io.sockets.on("connection", function(socket) {
  connections.push(socket);
  console.log("Connected: %s sockets connected", connections.length);

  // Disconnect
  socket.on("disconnect", function(data) {
    users.splice(users.indexOf(socket.username), 1); // Bug might be here since it needs to know where newUser is
    updateUsernames();
    connections.splice(connections.indexOf(socket), 1);
    console.log("Disconnected: %s sockets connected", connections.length);
    // console.log("socket.username is " + socket.username);
  });

  // Retrieve username and add to users array
  socket.on("new user", function(data) {
    socket.username = data.newUser;
    users.push(socket.username);
    updateUsernames();
    // console.log(users);
  });

  // Chat Step 2 - Listen to socket and take in data object from the client
  socket.on("chat", function(data) {
    io.sockets.emit("chat", data);
  });

  // Broadcast Typing Step 2 - Listen to socket and take in data object from the client
  socket.on("typing", function(data) {
    socket.broadcast.emit("typing", data);
  });

  function updateUsernames() {
    io.sockets.emit("get users", users);
  }
});

// Standard server listen request
server.listen(process.env.PORT, process.env.IP, function() {
   console.log("AirCamp is online!");
   console.log("PORT: " + process.env.PORT + " / " + "IP: " + process.env.IP);
});
