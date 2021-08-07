var express = require("express"),
    router = express.Router(),
    passport = require("passport"),
    async = require("async"),
    nodemailer = require("nodemailer"),
    crypto = require("crypto"),
    middleware = require("../middleware"),
    User = require("../models/user");

// Render landing page as our root "/" page
router.get("/", function(req, res) {
    res.render("landing");
});

// ======================
// AUTHENTICATION ROUTES
// ======================

// Register form
router.get("/register", function(req, res) {
    res.render("register", {page: "register"});
});

// Sign up logic
router.post("/register", function(req, res) {
    var newUser = new User({
        username: req.body.username.toLowerCase(),
        userDisplay: req.body.username,
        email: req.body.email,
        firstName: "New",
        lastName: "User",
        avatar: "https://tinyurl.com/yaraujs7",
        bio: "This user has not filled in any information."
    });

    // Lowercase username in the form to match the stored username we just created to prevent authentication bugs
    req.body.username = req.body.username.toLowerCase();

    User.register(newUser, req.body.password, function(err, user, next) {
        // Custom error message
        if (err) {
            if (err.message.indexOf("E11000") >= 0) {
              err.message = "The given email is already registered";
            }
            if (err.message.indexOf("Path `email` is required") >= 0) {
              err.message = "Please enter a valid email address";
            }
            // Log error
            console.log(err);
            return res.render("register", {error: err.message});
        }

        // Authenticate user
        passport.authenticate("local")(req, res, function() {
          // Flash then redirect to campgrounds
          req.flash("success", "Welcome to AirCamp, " + user.userDisplay + "!");
          res.redirect("/campgrounds");
        });
    });
});

// Login form
router.get("/login", function(req, res) {
    res.render("login", {page: "login"});
});

// Login logic
// Includes passport.authenticate() middleware
router.post("/login", middleware.usernameLower, passport.authenticate("local",
    {
        successReturnToOrRedirect: "/campgrounds",
        failureRedirect: "/login",
        successFlash: "Welcome back to AirCamp!",
        failureFlash: "Invalid username or password!"
    }), function(req, res) {
});

// Logout route
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect("/campgrounds");
});

// ===================================
// Password Forgot/Reset/Change Routes
// ===================================

// GET - Password forgot route
router.get('/forgot', function(req, res) {
    res.render('forgot');
});

// POST - Password forgot route
router.post('/forgot', function(req, res, next) {
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      User.findOne({ email: req.body.email }, function(err, user) {
        if (!user) {
          req.flash('error', 'No account with that email address exists.');
          return res.redirect('/forgot');
        }

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        user.save(function(err) {
          done(err, token, user);
        });
      });
    },
    function(token, user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: 'aircamp.forgot@gmail.com',
          pass: process.env.GMAILPW
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'aircamp.forgot@gmail.com',
        subject: 'Node.js Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        console.log('mail sent');
        req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
        done(err, 'done');
      });
    }
  ], function(err) {
    if (err) return next(err);
    res.redirect('/forgot');
  });
});

// GET - Password reset route
router.get('/reset/:token', function(req, res) {
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
    if (!user) {
      req.flash('error', 'Password reset token is invalid or has expired.');
      return res.redirect('/forgot');
    }
    res.render('reset', {token: req.params.token});
  });
});

// POST - Password reset route
router.post('/reset/:token', function(req, res) {
  async.waterfall([
    function(done) {
      User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (!user) {
          req.flash('error', 'Password reset token is invalid or has expired.');
          return res.redirect('back');
        }
        if(req.body.password === req.body.confirm) {
          user.setPassword(req.body.password, function(err) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;

            user.save(function(err) {
              req.logIn(user, function(err) {
                done(err, user);
              });
            });
          });
        } else {
            req.flash("error", "Passwords do not match.");
            return res.redirect('back');
        }
      });
    },
    // Drying code by using emailUser function
    emailUser
  ], function(err) {
    req.flash('success', 'Success! Your password has been changed.');
    res.redirect('/campgrounds');
  });
});

// GET - Password change route + user authentication
router.get('/change', middleware.isLoggedIn, function(req, res) {
  res.render("change", {page: "change"});
});

// POST - Password change route + user authentication
router.post('/change', middleware.isLoggedIn, function(req, res) {
  async.waterfall([
    function(done) {
      User.findOne({}, function(err, user) {
        if (!user) {
          // Testing password change
          console.log(user);
          console.log(typeof user);
          req.flash('error', 'Password reset token is invalid or has expired.');
          return res.redirect('back');
        }
        if(req.body.password === req.body.confirm) {
          user.setPassword(req.body.password, function(err) {

            user.save(function(err) {
              req.logIn(user, function(err) {
                done(err, user);
              });
            });
          });
        } else {
            req.flash("error", "Passwords do not match.");
            return res.redirect('back');
        }
      });
    },
    // Drying code by using emailUser function
    emailUser
  ], function(err) {
    req.flash('success', 'Success! Your password has been changed.');
    res.redirect('/campgrounds');
  });
});

function emailUser(user, done) {
  var smtpTransport = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'aircamp.forgot@gmail.com',
      pass: process.env.GMAILPW
    }
  });
  var mailOptions = {
    to: user.email,
    from: 'aircamp.forgot@gmail.com',
    subject: 'Your password has been changed',
    text: 'Hello ' + user.userDisplay + ',\n\n' +
      'This is a confirmation that the password for your account ' + user.email + ' on AirCamp has just been changed.\n'
  };
  smtpTransport.sendMail(mailOptions, function(err) {
    done(err);
  });
  done();
}

module.exports = router;
