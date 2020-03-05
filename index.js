const express = require('express');
const mongoose = require('mongoose');
const productRouter = require('./router/productRouter');
const userRouter = require('./router/userRouter');
const config = require('./config/config');
const app = express();

const path = require('path');

//middleware

app.use;
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

//router
app.use(productRouter, userRouter);

//listen to port
const PORT = process.env.PORT || 8000;
const options = {
	useUnifiedTopology: true,
	useNewUrlParser: true
};
mongoose
	.connect(config.databaseURL, options)
	.then(() => {
		console.log('Server is hosted on ' + PORT);
		app.listen(PORT);
	})
	.catch(e => {
		console.log(e);
	});

module.exports = { app };
