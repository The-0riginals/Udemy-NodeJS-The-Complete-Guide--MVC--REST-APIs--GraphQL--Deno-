const Product = require('../models/product');
const fileHelper = require('../util/file');
const { validationResult } = require('express-validator');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product',{
        pageTitle: 'Add Product', 
        path: '/admin/add-product', 
        editing: false,
        hasError: false,
        errorMessage: null,
        validationErrors: []
    });
};

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const image = req.file;
    const price = req.body.price;
    const description = req.body.description;
    const errors = validationResult(req);//this will check if there are any errors in the validation chain

    if(!image){//if there is no image
        return res.status(422).render('admin/edit-product', {
            pageTitle: 'Add Product',
            path: '/admin/add-product',
            editing: false,
            hasError: true,
            product: {
                title: title,
                price: price,
                description: description
            },
            errorMessage: 'Attached file is not an image.',
            validationErrors: []//this will display all the error messages
        });
    }

    if(!errors.isEmpty()){//if there are errors
        return res.status(422).render('admin/edit-product',{
            pageTitle: 'Add Product',
            path: '/admin/add-product',
            editing: false,
            hasError: true,
            product: {
                title: title,
                //imageUrl: imageUrl,
                price: price,
                description: description
            },
            errorMessage: errors.array()[0].msg,//this will display the first error message
            validationErrors: errors.array()//this will display all the error messages
        });
    }

    const imageUrl = image.path;//this will store the path of the image in the database

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
        //res.redirect('/500');
        //throw new Error('Creating a product failed.');
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);//this will skip all the other middlewares and go to the error handling middleware
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
        res.render('admin/edit-product',{
            pageTitle: 'Edit Product', 
            path: '/admin/edit-product', 
            editing: editMode,
            product: product,
            hasError: false,
            errorMessage: null,
            validationErrors: []
        });
    })
    .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);//this will skip all the other middlewares and go to the error handling middleware
    });
}

exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId;//this is the hidden input field in the edit-product.ejs file
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    //const updatedImageUrl = req.body.imageUrl;
    const image = req.file;
    const updatedDescription = req.body.description;
    const errors = validationResult(req);//this will check if there are any errors in the validation chain

    if(!errors.isEmpty()){//if there are errors
        return res.status(422).render('admin/edit-product',{
            pageTitle: 'Edit Product',
            path: '/admin/edit-product',
            editing: true,
            hasError: true,
            product: {
                title: updatedTitle,
                price: updatedPrice,
                description: updatedDescription,
                _id: prodId
            },
            errorMessage: errors.array()[0].msg,//this will display the first error message
            validationErrors: errors.array()//this will display all the error messages
        });
    }

    Product.findById(prodId)
    .then(product => {
        if(product.userId.toString() !== req.user._id.toString()){//toString() is used because product.userId and req.user._id are objects
            return res.redirect('/');
        }
        product.title = updatedTitle;
        product.price = updatedPrice;
        product.description = updatedDescription;
        if(image){//if there is an image
            fileHelper.deleteFile(product.imageUrl);//this will delete the old image
            product.imageUrl = image.path;//this will store the path of the image in the database
        }

        //product.imageUrl = updatedImageUrl;
        return product.save().then(result => {
            console.log('UPDATED PRODUCT!');
            res.redirect('/admin/products');
        }).catch(err => console.log(err));
    })
    .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);//this will skip all the other middlewares and go to the error handling middleware
    });
}

exports.getProducts = (req, res, next) => {
    Product.find({userId: req.user._id})//this will find all the products that have the same userId as the logged in user
    //.select('title price -_id')//this will select only the title and price fields and exclude the id field
    //.populate('userId','name')//this will populate the userId field with the entire user object or just the name field
    .then(products => {
        res.render('admin/products', {
            prods: products, 
            pageTitle: 'Admin Products', 
            path: '/admin/products'
        });
    })
    .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);//this will skip all the other middlewares and go to the error handling middleware
    });
}

exports.deleteProduct = (req, res, next) => {
    const prodId = req.path.productId;
    Product.findById(prodId)//this will find the product with the given id
    .then(product => {
        if(!product){
            return next(new Error('Product not found.'));
        }
        fileHelper.deleteFile(product.imageUrl);//this will delete the image
        return Product.deleteOne({_id: prodId, userId: req.user._id});//this will delete the product
    })
    .then(() => {
        console.log('DESTROYED PRODUCT');
        res.status(200).json({message: 'Success!'});
    })
    .catch(err => {
        res.status(500).json({message: 'Deleting product failed.'});
    });
}