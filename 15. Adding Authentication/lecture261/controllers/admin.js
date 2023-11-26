const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    createToken(res); // HERE IS USAGE
    res.render('admin/edit-product',{
        pageTitle: 'Add Product', 
        path: '/admin/add-product', 
        editing: false,
        isAuthenticated: req.session.isLoggedIn
    });
};

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    const product = new Product({
        title: title, 
        price: price, 
        description: description, 
        imageUrl: imageUrl,
        userId: req.user//mongoose will automatically pick the id from the user object
    });
    product.save()//save is a method provided by mongoose
    .then(result => {
        //console.log(result);
        console.log('Created Product');
        res.redirect('/admin/products');
    })
    .catch(err => {
        console.log(err);
    });
}

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;//this will be true if we are in edit mode
    //example: /admin/edit-product/0?edit=true
    if(!editMode){
        return res.redirect('/');
    }
    const prodId = req.params.productId; //this will be 0 in the above example

    Product.findById(prodId)
    .then(product => {
        if(!product){
            return res.redirect('/');
        }
        createToken(res); // HERE IS USAGE
        res.render('admin/edit-product',{
            pageTitle: 'Edit Product', 
            path: '/admin/edit-product', 
            editing: editMode,
            product: product,
            isAuthenticated: req.session.isLoggedIn
        });
    })
    .catch(err => console.log(err));
}

exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId;//this is the hidden input field in the edit-product.ejs file
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDescription = req.body.description;
    
    Product.findById(prodId)
    .then(product => {
        product.title = updatedTitle;
        product.price = updatedPrice;
        product.description = updatedDescription;
        product.imageUrl = updatedImageUrl;
        return product.save();
    })
    .then(result => {
        console.log('UPDATED PRODUCT!');
        res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
}

exports.getProducts = (req, res, next) => {
    Product.find()
    //.select('title price -_id')//this will select only the title and price fields and exclude the id field
    //.populate('userId','name')//this will populate the userId field with the entire user object or just the name field
    .then(products => {
        res.render('admin/products', {
            prods: products, 
            pageTitle: 'Admin Products', 
            path: '/admin/products',
            isAuthenticated: req.session.isLoggedIn
        });
    })
    .catch(err => console.log(err));
}

exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findByIdAndRemove(prodId)//this is a mongoose method
    .then(() => {
        console.log('DESTROYED PRODUCT');
        res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
}