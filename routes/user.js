const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl , isLoggedIn} = require("../middleware.js");

const userController = require("../controllers/users.js")

router.get("/signup",userController.renderSignUpForm);

router.post("/signup", wrapAsync(userController.signUp));

router.get("/login",userController.renderLoginForm);

router.post("/login", saveRedirectUrl ,passport.authenticate("local", {failureRedirect: '/login', failureFlash:true}) ,userController.login);

router.get("/logout",userController.logOut);

// Dashboard route for Admins
router.get("/admin/dashboard", isLoggedIn, (req, res) => {
    if (req.user.role === 'admin') {
        res.redirect("/listings/my-listings");
    } else {
        req.flash("error", "Access denied.");
        res.redirect("/listings");
    }
});

// Dashboard route for Users
router.get("/user/dashboard", isLoggedIn, (req, res) => {
    if (req.user.role === 'user') {
        res.render("dashboards/userDashboard.ejs");
    } else {
        req.flash("error", "Access denied.");
        res.redirect("/listings");
    }
});


module.exports = router;