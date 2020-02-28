const express = require('express');
const mongoose = require('mongoose');
const config = require('./config/config');
const productRouter = require('./router/productRouter');
const path = require('path');
const app = express();


app.use(productRouter);

const PORT = process.env.PORT || 8000;
const options = {
	useUnifiedTopology: true,
	useNewUrlParser: true
};
mongoose.connect(config.databaseURL, options).then(() => {
	console.log('Server is hosted on ' + PORT);
	app.listen(PORT);
});
