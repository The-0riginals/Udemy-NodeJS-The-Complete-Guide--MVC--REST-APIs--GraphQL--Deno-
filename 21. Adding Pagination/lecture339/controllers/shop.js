const Product = require('../models/product');
const Order = require('../models/order');

const fs = require('fs');
const path = require('path');

const PDFDocument = require('pdfkit');

//get all products
exports.getProducts = (req, res, next) => {
    const page = +req.query.page || 1;//if the query parameter page is not set then we will use 1 as the default value
    const itemsPerPage = 2;
    let totalItems;
    Product.find().countDocuments()//this will return the total number of products
    .then(numProducts => {
        totalItems = numProducts;
        return Product.find()
        .skip((page - 1) * itemsPerPage)//this will skip the first (page - 1) * itemsPerPage products
        .limit(itemsPerPage)//this will limit the number of products to itemsPerPage
    })
    .then(products => {
        //console.log(products);
        res.render('shop/product-list', {
            prods: products,
            pageTitle: 'Products',
            path: '/products',
            currentPage: page,
            hasNextPage: itemsPerPage * page < totalItems,//this will be true if there are more products to be displayed
            hasPreviousPage: page > 1,//this will be true if there are previous products to be displayed
            nextPage: page + 1,
            previousPage: page - 1,
            lastPage: Math.ceil(totalItems / itemsPerPage)//this will give us the last page number
        });
    })
    .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);//this will skip all the other middlewares and go to the error handling middleware
    });
}

//get a single product by id
exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findById(prodId)// findById is a mongoose method
    .then(product => {
        res.render('shop/product-detail', {
            product: product, 
            pageTitle: product.title, 
            path: '/products' // this path is used to highlight the active link in the navigation bar
        });
    })
    .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);//this will skip all the other middlewares and go to the error handling middleware
    });
}

// rows is an array of products: contains the actual data retrieved from the database
// fieldData is an array of additional information metadata about the query like field names, types, or other metadata.
exports.getIndex = (req, res, next) => {
    const page = +req.query.page || 1;//if the query parameter page is not set then we will use 1 as the default value
    const itemsPerPage = 2;
    let totalItems;
    Product.find().countDocuments()//this will return the total number of products
    .then(numProducts => {
        totalItems = numProducts;
        return Product.find()
        .skip((page - 1) * itemsPerPage)//this will skip the first (page - 1) * itemsPerPage products
        .limit(itemsPerPage)//this will limit the number of products to itemsPerPage
    })
    .then(products => {
        //console.log(products);
        res.render('shop/index', {
            prods: products,
            pageTitle: 'Shop',
            path: '/',
            currentPage: page,
            hasNextPage: itemsPerPage * page < totalItems,//this will be true if there are more products to be displayed
            hasPreviousPage: page > 1,//this will be true if there are previous products to be displayed
            nextPage: page + 1,
            previousPage: page - 1,
            lastPage: Math.ceil(totalItems / itemsPerPage)//this will give us the last page number
        });
    })
    .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);//this will skip all the other middlewares and go to the error handling middleware
    });
    // Product.find()
    // .then(products => {
    //     console.log(res);
    //     res.render('shop/index', {
    //         prods: products, 
    //         pageTitle: 'Shop', 
    //         path: '/'
    //     });
    // })
    // .catch(err => {
    //     const error = new Error(err);
    //     error.httpStatusCode = 500;
    //     return next(error);//this will skip all the other middlewares and go to the error handling middleware
    // });
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
            products: products
        });
    })
    .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);//this will skip all the other middlewares and go to the error handling middleware
    });
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
    .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);//this will skip all the other middlewares and go to the error handling middleware
    });
}

exports.postCartDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    req.user
    .removeFromCart(prodId)
    .then(result => {
        res.redirect('/cart');
    })
    .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);//this will skip all the other middlewares and go to the error handling middleware
    });
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
                email: req.user.email,
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
    .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);//this will skip all the other middlewares and go to the error handling middleware
    });
};

exports.getOrders = (req, res, next) => {
    Order.find({'user.userId': req.user._id})//this will find all the orders that have a userId that matches the current user id
    .then(orders => {
        res.render('shop/orders', {
            path: '/orders',
            pageTitle: 'Your Orders',
            orders: orders
        });
    })
    .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);//this will skip all the other middlewares and go to the error handling middleware
    });
};

exports.getInvoice = (req, res, next) => {
    const orderId = req.params.orderId;
    //console.log(orderId);
    Order.findById(orderId)
    .then(order => {
        //console.log(order);
        if(!order){
            //console.log('No order found.');
            return next(new Error('No order found.'));
        }
        if(order.user.userId.toString() !== req.user._id.toString()){
            //console.log('Unauthorized');
            return next(new Error('Unauthorized'));
        }
        const invoiceName = 'invoice-' + orderId + '.pdf';
        //console.log(invoiceName);
        const invoicePath = path.join('data','invoices',invoiceName);
        //console.log(invoicePath);

        //method 1
        // fs.readFile(invoicePath, (err, data) => {
        //     if(err){
        //         return next(err);
        //     }
        //     res.setHeader('Content-Type','application/pdf');
        //     res.setHeader('Content-Disposition','inline; filename="' + invoiceName + '"');
        //     res.send(data);
        // });

        //method 2
        // const file = fs.createReadStream(invoicePath);
        // res.setHeader('Content-Type','application/pdf');
        // res.setHeader('Content-Disposition','inline; filename="' + invoiceName + '"');
        // file.pipe(res);

        //method 3- automatic generation of pdf on the fly(we don't need to store the pdf in the file system)
        const pdfDoc = new PDFDocument();
        res.setHeader('Content-Type','application/pdf');
        res.setHeader('Content-Disposition','inline; filename="' + invoiceName + '"');
        //pine() will automatically write the data to the response stream
        pdfDoc.pipe(fs.createWriteStream(invoicePath));
        pdfDoc.pipe(res);
        pdfDoc.fontSize(26).text('Invoice', {//this will create a new line and generate the text'Invoice'
            underline: true
        });
        pdfDoc.text('-----------------------');
        let totalPrice = 0;
        order.products.forEach(prod => {
            totalPrice += prod.quantity * prod.product.price;
            pdfDoc.fontSize(14).text(prod.product.title + ' - ' + prod.quantity + ' x ' + '$' + prod.product.price);
        });
        pdfDoc.text('---');
        pdfDoc.fontSize(20).text('Total Price: $' + totalPrice);
        pdfDoc.end();
    })
    .catch(err => next(err));
}

//In Sequelize when you create any assciation between two models, sequelize provides us with some methods. For example in case of User.hasMany(Order) association sequelize provides us with:
// 1. add
// 2.count
// 3.create
// 4.get
// 5.has
// 6.remove
// 7.set