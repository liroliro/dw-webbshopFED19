const express = require('express');
const ProductModel = require('../model/product');
const BookingModel = require('../model/booking');
const router = express.Router();
const mongoose = require('mongoose');

router.get('/', (req, res) => {
	let pagination = req.query.page;
	res.render('index');
});

router.get('/admin', (req, res) => {
	res.render('admin');
});

router.get('/checkout', (req, res) => {
	res.render('checkout');
});

let newapartment;

router.post('/createproduct', async (req, res) => {
	newapartment = new ProductModel({
		city: req.body.city,
		street: req.body.street,
		descriptions: req.body.descriptions,
		room: req.body.room,
		productprice: req.body.productprice,
		url1: req.body.url1,
		url2: req.body.url2,
		url3: req.body.url3,
		user: '5e68cf2e94a6fb38f4adaded'
	}).save();

	//const response = await newapartment.save();
	res.redirect('/createproduct');
});

router.get('/createproduct', async (req, res) => {
	const product_per_page = 8;
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

router.get('/contact', (req, res) => {
	res.render('contact');
});

router.get('/my-pages', (req, res) => {
	res.render('my-pages');
});

router.get('/product', async (req, res) => {

	const product_per_page = 8;
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


let newBooking;
router.post('/addtocart', async (req, res) => {
	console.log(req.body);
	newBooking = await new BookingModel({
		/* ownerUserId: ,
		locationId: , */
		/* dateTimeFrom: req.body.dateTimeFrom, */

		bookingDate: req.body.bookingDate,
		numberOfAttendees: req.body.numberOfAttendees

	}).save();

	res.redirect('/addtocart');
});

//Försöker konvertera string till date i mongoDb
/* const bookingDb = BookingModel.find();

bookingDb.forEach(function (doc) {
	doc.bookingDate = new ISODate(doc.bookingDate);
	db.bookingDb.save(doc);
})

console.log(bookingDb);
 */

router.get('/addtocart', async (req, res) => {

	res.redirect('/product');
});



router.get("/update/:id", async (req, res) => {

	const response = await ProductModel.findById({ _id: req.params.id })
	console.log(response);

	res.render("edit", { response })
})

router.post("/update/:id", async (req, res) => {

	await ProductModel.updateOne({ _id: req.body._id },
		{
			$set: {
				city: req.body.city,
				street: req.body.street,
				descriptions: req.body.descriptions,
				room: req.body.room,
				productprice: req.body.productprice,
				url1: req.body.url1,
				url2: req.body.url2,
				url3: req.body.url3
			}
		},
		{ runValidators: true })
	console.log(req.body);
	res.redirect("/createproduct")
})


router.get("/delete/:id", async (req, res) => {
	await ProductModel
		.deleteOne({ _id: req.params.id });
	res.redirect("/createproduct")
})




module.exports = router;
