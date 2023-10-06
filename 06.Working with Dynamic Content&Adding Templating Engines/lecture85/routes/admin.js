const path = require('path');

const express = require('express');

const rootDir = require('../util/path');

const router = express.Router();

const products = [];

// /admin/add-product => GET
router.get('/add-product', (req, res, next) => {
    //console.log('In another middleware!');
    //send allows us to send a response to the client
    //res.sendFile(path.join(rootDir,'views','add-product.html'));
    res.render('add-product',{pageTitle: 'Add Product', path: '/admin/add-product'});
});

router.post('/add-product', (req, res, next) => {
    //console.log(req.body);
    products.push({title: req.body.title});
    res.redirect('/');
});

//module.exports = router;

exports.routes = router;
exports.products = products;