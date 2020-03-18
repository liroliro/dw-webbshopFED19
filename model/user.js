const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;

const userSchema = new Schema({
	email: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	resetToken: String,
	expirationToken: Date,
	wishlist: [
		{
			productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }
		}
	]
});

userSchema.methods.addToWishlist = function(product) {
	this.wishlist.push({ productId: product._id });
	return this.save();
};

const User = mongoose.model('User', userSchema);

module.exports = User;
