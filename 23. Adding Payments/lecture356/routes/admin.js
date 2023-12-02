const path = require('path');

const express = require('express');

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');//this is the middleware we created
const { check, body } = require('express-validator');//this is a function that returns a middleware

const router = express.Router();

// admin/add-product => GET
router.get('/add-product',isAuth, adminController.getAddProduct);

// admin/products => GET
router.get('/products',isAuth, adminController.getProducts);

router.post('/add-product',
    [
        body('title')
            .not().isEmpty()
            .isString()
            .isLength({min: 3})
            .trim(),
        //body('imageUrl').isURL(),
        body('price')
            .isFloat(),
        body('description')
            .isLength({min: 5, max: 400})
            .trim()
    ],//this is a middleware
    isAuth, 
    adminController.postAddProduct
);

router.get('/edit-product/:productId',isAuth, adminController.getEditProduct);

router.post('/edit-product',
    [
        body('title')
            .not().isEmpty()
            .isString()
            .isLength({min: 3})
            .trim(),
        //body('imageUrl').isURL(),
        body('price')
            .isFloat(),
        body('description')
            .isLength({min: 5, max: 400})
            .trim()
    ],//this is a middleware
    isAuth, 
    adminController.postEditProduct
);

//router.post('/delete-product',isAuth, adminController.postDeleteProduct);
router.delete('/product/:productId',isAuth, adminController.deleteProduct);

module.exports = router; //  sets the entire module.exports object to router
//This means that when you import this module in another file, you'll get the router object directly.
//adminRoutes will be the router object.

//exports.routes = router; // This statement adds a property called routes to the exports object.
//exports.products = products;
//this means 'adminRoutes.routes' will be the router object.

// we need to use module.exports instead of exports because exports is just a pointer to module.exports
// and we are changing the value of exports which is not possible