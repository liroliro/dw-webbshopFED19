const express = require('express');
const router = express.Router();
const User = require('../model/user');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const verifyToken = require("./verifyToken");
const config = require("../config/config");
const nodemailer = require("nodemailer");
const sendGridTransport = require("nodemailer-sendgrid-transport");
const crypto = require("crypto");
const transport = nodemailer.createTransport(sendGridTransport({
	auth: {
		api_key: config.mail
	}
}))


router.get('/register', async (req, res) => {
	res.render('register');
});

router.post('/register', async (req, res) => {
	const salt = await bcrypt.genSalt(10);
	const hashPassword = await bcrypt.hash(req.body.password, salt);
	await new User({
		email: req.body.email,
		password: hashPassword,
		resetToken: { type: String },
		expirationToken: Date
	}).save();

	const user = await User.find({ email: req.body.email });
	res.render('userprofile', { user });

	transport.sendMail({
		to: user.email,
		from: "<no-reply>hemNet@apartment.com",
		subject: "Login succeded",
		html: "<h1> Välkommen" + user.email + "</h1>"

	}).save();
});
//

router.get('/login', (req, res) => {
	res.render('login.ejs');
});

router.post('/login', async (req, res) => {
	//Hämta info från databas
	const user = await User.findOne({ email: req.body.loginEmail });

	if (!user) {
		return res.redirect('/register');
	}

	// Jämför information från databas till input
	const validUser = await bcrypt.compare(req.body.loginPassword, user.password);

	if (validUser) {
		const user = await User.find({ email: req.body.loginEmail });
		res.render('userprofile', { user });
	} else {
		res.redirect('/register');
	}

	jwt.sign({ user }, "secretkey", (err, token) => {
		if (err) res.redirect("/login")
		//console.log(token)
		if (token) {
			//Use localstorage
			//console.log("hej")
			// const cookie = req.cookies.jwtToken;
			const cookie = req.cookies.jsonwebtoken;
			if (!cookie) {

				//res.header("auth")
				res.cookie('jsonwebtoken', token, { maxAge: 3600000, httpOnly: true });
			}

			res.render("userProfile", { user })
		}
		res.redirect("/login")

	})

});

router.get("/logout", (req, res) => {

	res.clearCookie("jsonwebtoken").redirect("/login")
})

router.get("/reset", (req, res) => {
	res.render("reset")
})
router.post("/reset", async (req, res) => {
	//req.body.resetMail
	const existUser = await User.findOne({ email: req.body.resetMail })
	if (!existUser) return res.redirect("/signup");

	crypto.randomBytes(32, async (err, token) => {
		if (err) return res.redirect("/login");
		const resetToken = token.toString("hex");

		existUser.resetToken = resetToken;
		existUser.expirationToken = Date.now() + 1000000;
		await existUser.save();
	})
	res.send(existUser);
})

module.exports = router;
