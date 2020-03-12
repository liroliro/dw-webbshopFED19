
const express = require("express");
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth");

//Welcome Page
router.get("/", forwardAuthenticated, (req, res) => res.render("Welcome"));

// Dashboard page
router.get("/dashboard", (req, res) =>      //ensureAuthenticated,
res.render("dashboard", {
    admin: req.admin

}));


module.exports = router;  