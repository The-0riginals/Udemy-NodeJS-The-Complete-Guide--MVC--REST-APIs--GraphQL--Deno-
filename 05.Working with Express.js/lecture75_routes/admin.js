const path = require('path');

const express = require('express');

const rootDir = require('../lecture73_util/path');

const router = express.Router();

// /admin/add-product => GET
router.get('/add-product', (req, res, next) => {
    //console.log('In another middleware!');
    //send allows us to send a response to the client
    res.sendFile(path.join(rootDir,'lecture75_views','add-product.html'));
});

router.post('/add-product', (req, res, next) => {
    console.log(req.body);
    res.redirect('/');
});

module.exports = router;