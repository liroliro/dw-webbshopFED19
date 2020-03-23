const express = require('express');
const router = express.Router();
const User = require('../model/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const verifyToken = require('./verifyToken');
const config = require('../config/config');
const nodemailer = require('nodemailer');
const sendGridTransport = require('nodemailer-sendgrid-transport');
const crypto = require('crypto');
const Product = require('../model/product');

const transport = nodemailer.createTransport(
	sendGridTransport({
		auth: {
			api_key: config.mail
		}
	})
);

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

	const user = await User.findOne({ email: req.body.email });

	// Känns inte som vi behöver denna, då vi inte väl skicka mail vid registrering, antar jag?
	// transport.sendMail({
	//   to: user.email,
	//   from: "<no-reply>hemNet@apartment.com",
	//   subject: "Login succeded",
	//   html: "<h1> Välkommen" + user.email + "</h1>"
	// });
	
	res.render('userprofile', { user });
});

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

	if (!validUser) return res.redirect('/register');

	jwt.sign({ user }, 'secretKey', (err, token) => {
		if (err) res.redirect('/login');

		if (token) {
			const cookie = req.cookies.jsonwebtoken;
			if (!cookie) {
				res.cookie('jsonwebtoken', token, { maxAge: 3600000, httpOnly: true });
			}
			// console.log(user);
			res.render('userprofile', { user });
		}
		res.redirect('/login');
	});
});

router.get('/logout', (req, res) => {
	res.clearCookie('jsonwebtoken').redirect('/login');
});

router.get('/reset', (req, res) => {
	res.render('reset');
});
router.post('/reset', async (req, res) => {
	//req.body.resetMail
	const user = await User.findOne({ email: req.body.resetMail });
	if (!user) return res.redirect('/register');

	crypto.randomBytes(32, async (err, token) => {
		if (err) return res.redirect('/register');
		const resetToken = token.toString('hex');

		user.resetToken = resetToken;
		user.expirationToken = Date.now() + 1000000;
		await user.save();

		transport.sendMail({
			to: user.email,
			from: '<no-reply>hemNet@apartment.com',
			subject: 'Reset password',
			html: `<p>Du har begärt återställning av lösenord, använd denna länk för att åstadkomma detta! </p>
		<br />
		http://localhost:8000/reset/${resetToken}`
		});

		res.redirect('/');
	});
});

router.get('/reset/:token', async (req, res) => {
	const user = await User.findOne({
		resetToken: req.params.token,
		expirationToken: { $gt: Date.now() }
	});

	if (!user) return res.redirect('/register');

	res.render('resetForm', { user });
});

router.post('/reset/:token', async (req, res) => {
	const user = await User.findOne({ _id: req.body.userId });

	user.password = bcrypt.hash(req.body.password, 10);
	user.resetToken = undefined;
	user.expirationToken = undefined;
	await user.save();

	res.redirect('/login');
});

router.get('/wishlist/:id', verifyToken, async (req, res) => {
	const product = await Product.findOne({ _id: req.params.id });
	console.log(req.body);
	const user = await User.findOne({ _id: req.body.user._id });

	await user.addToWishlist(product);

	res.send('Wishlisted');
});

router.get('/addToCart/:id', verifyToken, async (req, res) => {
	const user = await User.findOne({ _id: req.body.user._id });
	await user.addToCart({ _id: req.params.id });

	res.redirect('/cart');
});

router.get('/cart', verifyToken, async (req, res) => {
	const user = await User.findOne({ _id: req.body.user._id });
	const products = [];
	for (let i = 0; i < user.cart.length; i++) {
		const product = await Product.findOne(user.cart[i].productId);

		products.push(product);
	}

	res.render('cart', { products });
});

router.get('/delete/:id', verifyToken, async (req, res) => {
	const user = await User.findOne({
		_id: req.body.user._id
	});

	user.cart.forEach((e, i) => {
		if (e.productId == req.params.id) {
			return user.cart.splice(i, 1);
		}
	});

	await user.save();

	res.redirect('/cart');
});

module.exports = router;
