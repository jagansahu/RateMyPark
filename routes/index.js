var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

router.get("/", (req, res) => {
    res.render("landing");
});

//-------------------------

router.get("/register", (req, res) => {
    res.render("register");
});

router.post("/register", (req, res) => {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, (err, user) => {
        if (err) {
            req.flash("error", err.message);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, () => {
            req.flash("success", "Welcome to RateMyPark " + user.username);
            res.redirect("/parks");
        });
    });
});

router.get("/login", (req, res) => {
    res.render("login");
});

router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/parks",
        failureRedirect: "/login"
    }),  (req, res) => {
});

router.get("/logout", (req, res) => {
    req.logOut();
    req.flash("success", "You have logged out of your account!")
    res.redirect("/parks");
});

module.exports = router;