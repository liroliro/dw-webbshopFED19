const express = require('express');
const ProductModel = require('../model/product');
const router = express.Router();

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

router.get('/createproduct', (req, res) => {
	const apartment = ProductModel;
	res.render('createproduct', {
		apartment
	});
});

//FUNKAR INTE VVVV
router.post('/createproduct', async (req, res) => {
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
});
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
	const countProduct = Items.find().countDocuments();

	const Items = await ProductModel.find()
		.skip(product_per_page * (page - 1)
			.limit(product_per_page);




	res.render('product.ejs', {
		Items,
		//total produkter
		countProduct,
		//current page
		currentPage: page,
		//om det finns en till sida. 
		hasNextPage: product_per_page < page * product_per_page,
		//has previous page
		hasNextPage: page > 1,
		//last page
		lastPage: math.ceil(countProduct / product_per_page),
		nextPage: page + 1,
		previousPage: page - 1
	});

});

router.post('/product', async (req, res) => {
	const newApartment = new ProductModel({
		name: req.body.name,
		room: req.body.room,
		price: req.body.price,
		url: req.body.url
	}).save();

	await newApartment.save((err, suc) => {
		err ? res.send(err.message) : res.redirect('/product');
	});
});

module.exports = router;
