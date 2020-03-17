const express = require('express');
const ProductModel = require('../model/product');
const router = express.Router();
const mongoose = require('mongoose');

router.get('/', (req, res) => {
	let pagination = req.query.page;
	res.render('index');
});

router.get('/admin', (req, res) => {
	res.render('admin');
});

router.get('/cart', (req, res) => {
	res.render('cart');
});

router.get('/checkout', (req, res) => {
	res.render('checkout');
});

let newapartment;

router.post('/createproduct', async (req, res) => {
	newapartment = new ProductModel({
		header: req.body.header,
		smallheader: req.body.smallheader,
		descriptions: req.body.descriptions,
		room: req.body.room,
		productprice: req.body.productprice,
		days: req.body.days,
		url1: req.body.url1,
		url2: req.body.url2,
		url3: req.body.url3,
		user: '5e68cf2e94a6fb38f4adaded'
	}).save();

	//const response = await newapartment.save();
	res.redirect('/createproduct');
});

router.get('/createproduct', async (req, res) => {
	const product_per_page = 4;
	const page = +req.query.page; //number(req.query.page)
	//räknar total antal produkter
	const countProduct = ProductModel.find().countDocuments();

	const products = await ProductModel.find()
		.populate('user -expirationToken -resetToken')
		.skip(product_per_page * (page - 1))
		.limit(product_per_page);

	res.render('createproduct.ejs', {
		products,
		//total produkter
		countProduct,
		//current page
		currentPage: page,
		//om det finns en till sida.
		hasNextPage: product_per_page < page * product_per_page,
		//has previous page
		hasPreviousPage: page > 1,
		nextPage: page + 1,
		previousPage: page - 1,

		//last page
		lastPage: Math.ceil(countProduct / product_per_page)
	});
});

//FUNKAR INTE VVVV
/* router.post('/createproduct', async (req, res) => {
	console.log(
		req.body.name +
		' ' +
		req.body.room +
		' ' +
		req.body.price +
		' ' +
		req.body.url
	);
	const apartment = await new ProductModel({
		name: req.body.name,
		room: req.body.room,
		price: req.body.productPrice,
		url: req.body.productUrl,
		days: req.body.days
	});
	console.log(apartment);

	apartment.save((error, success) => {
		if (error) {
			res.send(error._message);
		} else {
			res.render('createproduct');
		}
	});
}); */
//FUNKAR INTE ^^^^

router.get('/contact', (req, res) => {
	res.render('contact');
});

router.get('/my-pages', (req, res) => {
	res.render('my-pages');
});

router.get('/product', async (req, res) => {
	const product_per_page = 4;
	const page = +req.query.page; //number(req.query.page)
	//räknar total antal produkter
	const countProduct = ProductModel.find().countDocuments();

	const products = await ProductModel.find()
		.skip(product_per_page * (page - 1))
		.limit(product_per_page);

	res.render('product.ejs', {
		products,
		//total produkter
		countProduct,
		//current page
		currentPage: page,
		//om det finns en till sida.
		hasNextPage: product_per_page < page * product_per_page,
		//has previous page
		hasPreviousPage: page > 1,
		nextPage: page + 1,
		previousPage: page - 1,

		//last page
		lastPage: Math.ceil(countProduct / product_per_page)
	});
});

/* router.post('/product', async (req, res) => {
	const newApartment = new ProductModel({
		name: req.body.name,
		room: req.body.room,
		price: req.body.price,
		url: req.body.url
	}).save();

	await newApartment.save((err, suc) => {
		err ? res.send(err.message) : res.redirect('/product');
	});
}); */
console.log(newapartment);
module.exports = router;
