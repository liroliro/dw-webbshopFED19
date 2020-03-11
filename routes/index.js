
const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../config/auth");

//Welcome Page
router.get("/", (req, res) => res.render("Welcome"));

// Dashboard page
router.get("/dashboard", (req, res) =>      //ensureAuthenticated,
res.render("dashboard", {
    //name: req.admin.name

}));


module.exports = router;  