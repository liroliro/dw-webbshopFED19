const express = require('express')
const ProductModel = require('../model/product')


const router = express.Router();

router.get('/product', (req, res) => {
    apartment = ProductModel
    res.render('product', {
        apartment
    })
})

module.exports = { router }
//Testing