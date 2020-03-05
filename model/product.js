const mongoose = require('mongoose');


const productSchema = new mongoose.Schema(
	{
	name: {
		type: String,
	},
	room: {
		type: Number,
	},
	price: {
		type: Number,
	},
	days: {
		type: Number,
	},
	url: {
		type: String,
	}
});

const ProductModel = mongoose.model('ProductModel', productSchema);

module.exports = ProductModel;
