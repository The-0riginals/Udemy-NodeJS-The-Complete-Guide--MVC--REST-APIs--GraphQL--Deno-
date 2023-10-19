const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    //console.log('In another middleware!');
    //send allows us to send a response to the client
    //res.sendFile(path.join(rootDir,'views','add-product.html'));
    res.render('admin/edit-product',{
        pageTitle: 'Add Product', 
        path: '/admin/add-product', 
        editing: false
    });
};

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    // Product.create({
    //     title: title,
    //     price: price,
    //     imageUrl: imageUrl,
    //     description: description
    // })
    req.user.createProduct({//this is a sequelize method that will create a product for the user    
        title: title,
        price: price,
        imageUrl: imageUrl,
        description: description
    })
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
    req.user
    .getProducts({where: {id: prodId}})//this is a sequelize method that will get all the products for the user
    //Product.findByPk(prodId)
    .then(products => {
        const product = products[0];
        if(!product){
            return res.redirect('/');
        }
        res.render('admin/edit-product',{
            pageTitle: 'Edit Product', 
            path: '/admin/edit-product', 
            editing: editMode,
            product: product
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
    console.log(prodId);
    Product.findByPk(prodId)
    .then(product => {
        product.title = updatedTitle;
        product.price = updatedPrice;
        product.imageUrl = updatedImageUrl;
        product.description = updatedDescription;
        console.log("reached here");
        return product.save(); //you need return cuz the next .then() won't execute until product.save() has completed and the .catch() will also catch any errors thrown by it.
    })
    .then(result => {
        console.log('UPDATED PRODUCT!');
        res.redirect('/admin/products');
        //product.save() is asynchronous, so the next .then() won't execute until product.save() has completed and the .catch() will also catch any errors thrown by it.
    })
    .catch(err => console.log(err));

    // alternative way to update a product
    // Product.update({
    //     title: updatedTitle,
    //     price: updatedPrice,
    //     imageUrl: updatedImageUrl,
    //     description: updatedDescription
    // },{
    //     where: {
    //         id: prodId
    //     }
    // })
    //   .then(([updatedCount]) => {   
    //      if (updatedCount === 1) {
    //          console.log('User updated successfully');
    //          res.redirect('/');
    //      } else {
    //          console.error(`No user found with id ${userId}`);
    //      }
    //  })
    // .catch(err => console.log('Erro updating product', err));

}

exports.getProducts = (req, res, next) => {
    req.user
    .getProducts()//this is a sequelize method that will get all the products for the user
    //Product.findAll()
    .then(products => {
        res.render('admin/products', {
            prods: products, 
            pageTitle: 'Admin Products', 
            path: '/admin/products'
        });
    })
    .catch(err => console.log(err));
}

exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findByPk(prodId)
    .then(product => {
        return product.destroy();
    })
    .then(result => {
        console.log('DESTROYED PRODUCT');
        res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
    // alternative way to delete a product
    // Product.detroy({
    //     where: {
    //         id: prodId
    //     }
    // })
    // .then(result => {
    //     console.log('DESTROYED PRODUCT');
    //     res.redirect('/admin/products');
    // })
    // .catch(err => console.log(err));
}