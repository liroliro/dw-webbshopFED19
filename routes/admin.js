
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
const { ensureAuthenticated } = require("../config/auth");


// Admin model 
const Admin = require("../models/Admin");
const { forwardAuthenticated } = require('../config/auth');

// Login page
router.get("/login", (req, res) => res.render("login"));    //forwardAuthenticated,


// Register page
router.get("/register", (req, res) => res.render("register"));     //ensureAuthenticated,



// Register handle 
router.post("/register", (req, res) => {
    const { employeeId, password, password2 } = req.body; 
    let errors = [];

    //Check required fields
    if(!employeeId || !password || !password2) {
        errors.push({ msg: "Please fill in all fields" });
    }
   
//Check passwords match 
if(password !== password2) {
    errors.push({ msg: "Passwords do not match" });
}

// Check password length 
if(password.length < 6) {
    errors.push({ msg: "Password should be at least 6 characters" });
}

if(errors.length > 0) {
    res.render("register", {
        errors,  
        employeeId,
        password,
        password2
    });
    } else {
        // Validation passed
        Admin.findOne({ employeeId: employeeId})
            .then(admin => {
                if(admin) {
                    //Admin exists
                    errors.push({ msg: "Employee is already registered"});
                    res.render("register", {
                        errors,
                        employeeId,
                        password,
                        password2
                    });
                }   else {
                    const newAdmin = new Admin({
                        employeeId: employeeId,
                        password: password, 

                    });
                    // Hash password
                    bcrypt.genSalt(10, (err, salt)=> {
                        bcrypt.hash(newAdmin.password, salt, (err, hash) => {
                            if(err) throw err;

                            //Set password to hashed
                            newAdmin.password = hash;
                            // Save admin in mongoDB
                            newAdmin.save()
                                .then(admin => {             //ÄR DETTA FELET?
                                    req.flash(
                                        "success_msg",
                                        "You are now registered and can log in"
                                        );
                                    res.redirect("/admin/login");
                                })
                                .catch(err => console.log(err));

                    });

                });
            }
    });

    }
}); 

//Login handle
router.post("/login", (req, res, next) => {

    passport.authenticate("local", {
    successRedirect:  "/dashboard", 
    failureRedirect: "/admin/login",
    failureFlash: true
})(req, res, next);

});

//Logout handel 
router.get("/logout", (req, res) => {
    req.logout();
    req.flash("success_msg", "You are logged out");
    res.redirect("/admin/login");
});
 
module.exports = router; 