const e = require('express');
const Product = require('../models/product');
const Cart = require('../models/cart');

//get all products
exports.getProducts = (req, res, next) => {
    Product.findAll()
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
    // Product.findAll({where: {id: prodId}}) // findAll returns an array of products
    // .then(products => {
    //     res.render('shop/product-detail', {
    //         product: products[0], 
    //         pageTitle: products[0].title, 
    //         path: '/products' // this path is used to highlight the active link in the navigation bar
    //     });
    // })
    // .catch(err => console.log(err));

    // alternative way to get a single product by id
    Product.findByPk(prodId)
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
    Product.findAll()
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
    .then(cart => {
        return cart
        .getProducts()// this was added by sequelize cuz we defined the relationship between cart and product
        .then(products => {
            res.render('shop/cart', {
                path: '/cart',
                pageTitle: 'Your Cart',
                products: products
            });
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
};



exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    let fetchedCart;
    let newQuantity = 1;
    req.user
    .getCart()// this was added by sequelize cuz we defined the relationship between user and cart(magic method)
    .then(cart => {
        fetchedCart = cart;
        return cart.getProducts({where: {id: prodId}});// this was added by sequelize cuz we defined the relationship between cart and product
    })
    .then(products => {
        let product;
        if(products.length > 0){
            product = products[0];
        }
        if(product){
            const oldQuantity = product.cartItem.quantity;// extra field added by sequelize cuz we defined the relationship between cart and product
            newQuantity = oldQuantity + 1;
            return product;
        }
        return Product.findByPk(prodId);
    })
    .then(product => {
        return fetchedCart.addProduct(product, {through: {quantity: newQuantity}});// another magic method added by sequelize
    })
    .then(() => {
        res.redirect('/cart');
    })
    .catch(err => console.log(err));

}

exports.postCartDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    req.user
    .getCart()
    .then(cart => {
        return cart.getProducts({where: {id: prodId}});
    })
    .then(products => {
        const product = products[0];
        return product.cartItem.destroy();
    })
    .then(result => {
        res.redirect('/cart');
    })
    .catch(err => console.log(err));
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