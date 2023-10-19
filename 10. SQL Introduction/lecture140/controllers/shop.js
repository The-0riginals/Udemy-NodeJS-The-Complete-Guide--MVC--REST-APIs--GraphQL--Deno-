const e = require('express');
const Product = require('../models/product');
const Cart = require('../models/cart');

//get all products
exports.getProducts = (req, res, next) => {
    Product.fetchAll()
    .then(([rows, fieldData]) => {
        console.log(rows);
        res.render('shop/product-list', {
            prods: rows, 
            pageTitle: 'Shop', 
            path: '/products'
        });
    })
    .catch(
        err => console.log(err)
    );
}

//get a single product by id
exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findById(prodId)
    .then(([product]) => {
        res.render('shop/product-detail', {
            product: product[0], // product is an array of products, so we need to get the first element
            pageTitle: product.title, 
            path: '/products' // this path is used to highlight the active link in the navigation bar
        });
    })
    .catch(err => console.log(err));
}

// rows is an array of products: contains the actual data retrieved from the database
// fieldData is an array of additional information metadata about the query like field names, types, or other metadata.
exports.getIndex = (req, res, next) => {
    Product.fetchAll()
    .then(([rows, fieldData]) => {
        console.log(rows);
        res.render('shop/product-list', {
            prods: rows, 
            pageTitle: 'Shop', 
            path: '/products'
        });
    })
    .catch(
        err => console.log(err)
    );
}

exports.getCart = (req, res, next) => {
    Cart.getCart(cart => {
        Product.fetchAll(products => {
            const cartProducts = [];
            for(product of products){
                const cartProductData = cart.products.find(prod => prod.id === product.id);
                if(cartProductData){
                    cartProducts.push({productData: product, qty: cartProductData.qty});
                }
            }
            res.render('shop/cart', {
                pageTitle: 'Your Cart', 
                path: '/cart', 
                products: cartProducts
            });
        });
    });
}

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findById(prodId, product => {
        Cart.addProduct(prodId, product.price);
    });
    res.redirect('/cart');
}

exports.postCartDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findById(prodId, product => {
        if (!product) {
            // Handle the case where product is not found
            console.log('Product not found');
            console.log(prodId);
            console.log(req.body.productId);
            console.log("end");
            res.redirect('/cart');
            return;
        }
        Cart.deleteProduct(prodId, product.price);
        res.redirect('/cart');
    });
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