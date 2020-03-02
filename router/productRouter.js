const express = require('express')
const ProductModel = require('../model/product')
const router = express.Router();

router.get('/createproduct', (req, res) => {
    apartment = ProductModel
    res.render('createproduct', {
        apartment
    })
})

router.post("/product", async (req, res) => {

    const newapartment = new ProductModel({
        name: req.body.name,
        room: req.body.room,
        price: req.body.price,
        url: req.body.url
    })

    const response = await newapartment.save();
    res.redirect("/product")
})

module.exports = router;
