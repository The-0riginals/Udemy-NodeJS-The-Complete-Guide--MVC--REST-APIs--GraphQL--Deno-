const path = require('path');

const express = require('express');

const shopController = require('../controllers/shop');

const router = express.Router();

router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);

router.get('/products/:productId', shopController.getProduct);
// :productId is a dynamic segment: /products/123
// if we have multiple dynamic segments, the order of the routes matters
// if we have /products/:productId and /products/create, the create route will never be reached
// instead, we should put the create route before the dynamic route

router.get('/cart', shopController.getCart);

router.post('/cart', shopController.postCart);

router.post('/cart-delete-item', shopController.postCartDeleteProduct);

router.post('/create-order', shopController.postOrder);

router.get('/orders', shopController.getOrders);



module.exports = router;
