const path = require('path');

const express = require('express');

const productsController = require('../controllers/products');
const router = express.Router();

// /admin/add-product => GET
router.get('/add-product', productsController.getAddProduct);

router.post('/add-product', productsController.postAddProduct);

module.exports = router; //  sets the entire module.exports object to router
//This means that when you import this module in another file, you'll get the router object directly.
//adminRoutes will be the router object.

//exports.routes = router; // This statement adds a property called routes to the exports object.
//exports.products = products;
//this means 'adminRoutes.routes' will be the router object.

// we need to use module.exports instead of exports because exports is just a pointer to module.exports
// and we are changing the value of exports which is not possible