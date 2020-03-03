const express = require('express')
const ProductModel = require('../model/product')
const router = express.Router();

router.get('/', (req, res) => {
    let pagination = req.query.page;
    res.render('index');
})

router.get('/admin', (req, res) => {
    res.render('admin')
})

router.get('/cart', (req, res) => {
    res.render('cart')
})

router.get('/checkout', (req, res) => {
    res.render('checkout')
})

router.get('/createproduct', (req, res) => {
    const apartment = ProductModel
    res.render('createproduct', {
        apartment
    })
})


//FUNKAR INTE VVVV
router.post('/createproduct', async (req, res) => {
    const apartment = new ProductModel({
        name: req.body.name,
        room: req.body.room,
        price: req.body.price,
        url: req.body.url
    })

    await apartment.save();
    res.redirect('/createproduct')

})
//FUNKAR INTE ^^^^


router.get('/contact', (req, res) => {
    res.render('contact')
})

router.get('/my-pages', (req, res) => {
    res.render('my-pages')
})


router.get('/product', async (req, res) => {
    const Items = await ProductModel.find();

    res.render('product', {
        Items
    })
})

router.post("/product", async (req, res) => {

    const newApartment = new ProductModel({
        name: req.body.name,
        room: req.body.room,
        price: req.body.price,
        url: req.body.url
    })

    await newApartment.save((err, suc) => {
        err ? res.send(err.message) : res.redirect('/product')
    })

})

module.exports = router;