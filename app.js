const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");

const app = express();

//passport config
require("./config/passport")(passport);

//DB config
const db = require("./config/config").databaseURL;

// Connect to Mongo 
mongoose.connect(db, {
        useNewUrlParser: true
    })
    .then(() => console.log("MongoDB Connected..."))
    .catch(err => console.log(err));
// EJS 
app.use(expressLayouts); //Denna över
app.set("view engine", "ejs"); //Denna under

// bodyparser
app.use(express.urlencoded({
    extended: false
}));

// Express session 
app.use(session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
}));

//passport middleware 
app.use(passport.initialize());
app.use(passport.session());


// connect flash
app.use(flash());

// global variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error");
    next();
});


// Routes 
app.use("/", require("./routes/index"));
app.use("/admin", require("./routes/admin"));

const PORT = process.env.PORT || 5001;


app.listen(PORT, console.log(`Server started on port ${PORT}`));
