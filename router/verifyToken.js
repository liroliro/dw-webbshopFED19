const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
	const token = req.cookies.jsonwebtoken;
	if (token) {
		const user = jwt.verify(token, 'secretKey');
		// console.log(user);
		req.body = user;

		next();
	} else {
		res.send('You are not authorized.');
	}
};
