const mongoose = require('mongoose');


const productSchema = new mongoose.Schema(
	{
	header: {
		type: String,
	},
	smallheader: {
		type: String,
	},
	descriptions: {
		type: String,
	},
	room: {
		type: Number,
	},
	productprice: {
		type: Number,
	},
	days: {
		type: Number,
	},
	url1: {
		type: String,
	},
	url2: {
		type: String,
	},
	url3: {
		type: String,
	}
});

const ProductModel = mongoose.model('ProductModel', productSchema);

module.exports = ProductModel;
