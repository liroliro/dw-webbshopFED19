const express = require('express');
const router = express.Router();
const User = require('../model/user');

const verifyToken = require ("./verifyToken")

const bcrypt = require('bcryptjs');

router.get('/register', async (req, res) => {
	res.render('register');
});

router.post('/register', async (req, res) => {
	const salt = await bcrypt.genSalt(10);
	const hashPassword = await bcrypt.hash(req.body.password, salt);
	await new User({
		email: req.body.email,
		password: hashPassword
	}).save();

	const user = await User.find({ email: req.body.email });
	res.render('userprofile', { user });
});

router.get('/login', (req, res) => {
	res.render('login.ejs');
});

router.post('/login', async (req, res) => {
	//Hämta info från databas
	const user = await User.findOne({ email: req.body.loginEmail });

	if (!user) {
		res.redirect('/register');
	}

	// Jämför information från databas till input
	const validUser = await bcrypt.compare(req.body.loginPassword, user.password);

	if (validUser) {
		const user = await User.find({ email: req.body.loginEmail });
		res.render('userprofile', { user });
	} else {
		res.redirect('/register');
	}
});


router.get("/logout", (req, res)=>{
	
	res.clearCookie("jsonwebtoken").redirect("/login")
})

module.exports = router;
