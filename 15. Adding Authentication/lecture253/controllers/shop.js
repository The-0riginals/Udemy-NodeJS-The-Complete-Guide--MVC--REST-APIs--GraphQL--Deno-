const Product = require('../models/product');
const Order = require('../models/order');

//get all products
exports.getProducts = (req, res, next) => {
    Product.find()//this will return all the products
    .then(products => {
        //console.log(products);
        res.render('shop/product-list', {
            prods: products, 
            pageTitle: 'All Products', 
            path: '/products',
            isAuthenticated: req.session.isLoggedIn
        });
    })
    .catch(err => console.log(err));
}

//get a single product by id
exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findById(prodId)// findById is a mongoose method
    .then(product => {
        res.render('shop/product-detail', {
            product: product, 
            pageTitle: product.title, 
            path: '/products', // this path is used to highlight the active link in the navigation bar
            isAuthenticated: req.session.isLoggedIn
        });
    })
    .catch(err => console.log(err));
}

// rows is an array of products: contains the actual data retrieved from the database
// fieldData is an array of additional information metadata about the query like field names, types, or other metadata.
exports.getIndex = (req, res, next) => {
    Product.find()
    .then(products => {
        res.render('shop/index', {
            prods: products, 
            pageTitle: 'Shop', 
            path: '/',
            isAuthenticated: req.session.isLoggedIn
        });
    })
    .catch(err => console.log(err));
};

exports.getCart = (req, res, next) => { // our controller function
    req.user
    .populate('cart.items.productId')//this will populate the productId field with the entire product object
    .then(user => {
        console.log(user.cart.items);
        const products = user.cart.items;
        res.render('shop/cart', {
            path: '/cart',
            pageTitle: 'Your Cart',
            products: products,
            isAuthenticated: req.session.isLoggedIn
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
    .removeFromCart(prodId)
    .then(result => {
        res.redirect('/cart');
    })
    .catch(err => console.log(err));
}

exports.postOrder = (req, res, next) => {
    req.user
    .populate('cart.items.productId')
    .then(user => {
        const products = user.cart.items.map(i => {
            return {quantity: i.quantity, product: {...i.productId._doc}};//_doc will give us the actual product data which is stored in the productId field
        });
        const order = new Order({
            user: {
                name: req.user.name,
                userId: req.user
            },
            products: products
        });
        return order.save();
    })
    .then(result => {
        return req.user.clearCart();
    })
    .then(() => {
        res.redirect('/orders');
    })
    .catch(err => console.log(err));
};

exports.getOrders = (req, res, next) => {
    Order.find({'user.userId': req.user._id})//this will find all the orders that have a userId that matches the current user id
    .then(orders => {
        res.render('shop/orders', {
            path: '/orders',
            pageTitle: 'Your Orders',
            orders: orders,
            isAuthenticated: req.session.isLoggedIn
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