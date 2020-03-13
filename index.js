const express = require('express');
const mongoose = require('mongoose');
const productRouter = require('./router/productRouter');
const userRouter = require('./router/userRouter');
const config = require('./config/config');

const cookieParser = require("cookie-parser");

const expressLayouts = require("express-ejs-layouts"); //admin
const flash = require("connect-flash"); //admin
const session = require("express-session"); //admin
const passport = require("passport"); //admin

//passport config admin
require("./config/passport")(passport);


const path = require('path');

//middleware
const app = express();

app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressLayouts); //Admin
app.set('view engine', 'ejs');

// Express session admin
app.use(session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,}));

	//passport middleware admin
app.use(passport.initialize());
app.use(passport.session());

// connect flash admin
app.use(flash());

// global variables admin
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error");
    next();
});

//router
app.use(productRouter);
app.use(userRouter)

//Admin routes
app.use("/", require("./router/adminRouter"));
app.use("/admin", require("./router/adminRouter"));

//listen to port
const PORT = process.env.PORT || 8000;
const options = {
	useUnifiedTopology: true,
	useNewUrlParser: true
};
mongoose
	.connect(config.databaseURL, options)
	.then(() => {
		
		console.log('Server is hosted on ' + PORT);
		app.listen(PORT);
	})

module.exports = { app };
