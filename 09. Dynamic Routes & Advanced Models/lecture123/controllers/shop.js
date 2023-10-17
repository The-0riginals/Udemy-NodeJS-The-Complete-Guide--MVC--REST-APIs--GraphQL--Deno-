const e = require('express');
const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => {
    Product.fetchAll(products => {
        //use template engine
        res.render('shop/product-list', {
            prods: products, 
            pageTitle: 'All Products', 
            path: '/products'
        });
    });
}

exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findById(prodId, product => {
        res.render('shop/product-detail', {
            product: product, 
            pageTitle: product.title, 
            path: '/products' // this path is used to highlight the active link in the navigation bar
        });
    });
}

exports.getIndex = (req, res, next) => {
    Product.fetchAll(products => {
        //use template engine
        res.render('shop/index', {
            prods: products, 
            pageTitle: 'Shop', 
            path: '/'
        });
    });
}

exports.getCart = (req, res, next) => {
    res.render('shop/cart', {
        pageTitle: 'Your Cart', 
        path: '/cart', 
        //layout: false
    });
}

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findById(prodId, product => {
        Cart.addProduct(prodId, product.price);
    });
    res.redirect('/cart');
}

exports.getOrders = (req, res, next) => {
    res.render('shop/orders', {
        pageTitle: 'Your Orders', 
        path: '/orders', 
        //layout: false
    });
}

exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        pageTitle: 'Checkout', 
        path: '/checkout', 
        //layout: false
    });
}