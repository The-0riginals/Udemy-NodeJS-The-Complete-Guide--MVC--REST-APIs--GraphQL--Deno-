const path = require('path');

const express = require('express');

const shopController = require('../controllers/shop');
const isAuth = require('../middleware/is-auth');//this is the middleware we created

const router = express.Router();

router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);

router.get('/products/:productId', shopController.getProduct);
// :productId is a dynamic segment: /products/123
// if we have multiple dynamic segments, the order of the routes matters
// if we have /products/:productId and /products/create, the create route will never be reached
// instead, we should put the create route before the dynamic route

router.get('/cart',isAuth, shopController.getCart);

router.post('/cart',isAuth, shopController.postCart);

router.post('/cart-delete-item',isAuth, shopController.postCartDeleteProduct);

router.get('/checkout',isAuth, shopController.getCheckout);

router.get('/checkout/success', shopController.getCheckoutSuccess);

router.get('/checkout/cancel', shopController.getCheckout);

//router.post('/create-order',isAuth, shopController.postOrder);

router.get('/orders',isAuth, shopController.getOrders);

router.get('/orders/:orderId',isAuth, shopController.getInvoice);



module.exports = router;
