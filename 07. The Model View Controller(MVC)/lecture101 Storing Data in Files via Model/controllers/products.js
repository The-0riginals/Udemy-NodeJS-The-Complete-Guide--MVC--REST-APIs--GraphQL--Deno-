const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    //console.log('In another middleware!');
    //send allows us to send a response to the client
    //res.sendFile(path.join(rootDir,'views','add-product.html'));
    res.render('add-product',{
        pageTitle: 'Add Product', 
        path: '/admin/add-product', 
        formsCSS: true, 
        productCSS: true, 
        activeAddProduct: true});
};

exports.postAddProduct = (req, res, next) => {
    //products.push({title: req.body.title});
    const product = new Product(req.body.title);
    product.save();
    res.redirect('/');
}

exports.getProducts = (req, res, next) => {
    Product.fetchAll(products => {
        //use template engine
        res.render('shop', {
            prods: products, 
            pageTitle: 'Shop', 
            path: '/', hasProducts: products.length > 0, 
            activeShop: true, 
            productCSS: true,
            //layout: false
        });
    });
}