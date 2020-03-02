const mongoose = require('mongoose');


const productSchema = new mongoose.Schema({
	product: {
		name: String,
		room: Number,
		price: Number,
		url: String,
	
	}
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
