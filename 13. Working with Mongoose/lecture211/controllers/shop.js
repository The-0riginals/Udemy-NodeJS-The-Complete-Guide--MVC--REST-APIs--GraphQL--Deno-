const e = require('express');
const Product = require('../models/product');

//get all products
exports.getProducts = (req, res, next) => {
    Product.fetchAll()
    .then(products => {
        res.render('shop/product-list', {
            prods: products, 
            pageTitle: 'All Products', 
            path: '/products'
        });
    })
    .catch(err => console.log(err));
}

//get a single product by id
exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findById(prodId)
    .then(product => {
        res.render('shop/product-detail', {
            product: product, 
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
    .then(products => {
        res.render('shop/index', {
            prods: products, 
            pageTitle: 'Shop', 
            path: '/'
        });
    })
    .catch(err => console.log(err));
};

exports.getCart = (req, res, next) => { // our controller function
    req.user
    .getCart()// this was added by sequelize cuz we defined the relationship between user and cart(magic method)
    .then(products => {
            res.render('shop/cart', {
                path: '/cart',
                pageTitle: 'Your Cart',
                products: products
            });
        })
    .catch(err => console.log(err));
};



exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findById(prodId)
    .then(product => {
        return req.user.addToCart(product);
    })
    .then(result => {
        console.log(result);
        res.redirect('/cart');
    })
    .catch(err => console.log(err));
}

exports.postCartDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    req.user
    .deleteItemFromCart(prodId)
    .then(result => {
        res.redirect('/cart');
    })
    .catch(err => console.log(err));
}

exports.postOrder = (req, res, next) => {
    let fetchedCart;
    req.user
      .addOrder()
      .then(result => {
        res.redirect('/orders');
      })
      .catch(err => console.log(err));
  };

exports.getOrders = (req, res, next) => {
    req.user
      .getOrders()
      .then(orders => {
        res.render('shop/orders', {
          path: '/orders',
          pageTitle: 'Your Orders',
          orders: orders
        });
      })
      .catch(err => console.log(err));
};
//In Sequelize when you create any assciation between two models, sequelize provides us with some methods. For example in case of User.hasMany(Order) association sequelize provides us with:
// 1. add
// 2.count
// 3.create
// 4.get
// 5.has
// 6.remove
// 7.set