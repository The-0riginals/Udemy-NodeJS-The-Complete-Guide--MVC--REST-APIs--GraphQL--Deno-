const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    //console.log('In another middleware!');
    //send allows us to send a response to the client
    //res.sendFile(path.join(rootDir,'views','add-product.html'));
    res.render('admin/add-product',{
        pageTitle: 'Add Product', 
        path: '/admin/add-product', 
        formsCSS: true, 
        productCSS: true, 
        activeAddProduct: true});
};

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    //console.log(req.body);
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    const product = new Product(title, imageUrl, description, price);
    //const product = new Product(req.body.title);
    product.save();
    res.redirect('/');
}

exports.getProducts = (req, res, next) => {
    Product.fetchAll(products => {
        //use template engine
        res.render('admin/products', {
            prods: products, 
            pageTitle: 'Admin Products', 
            path: '/admin/products'
        });
    });
}