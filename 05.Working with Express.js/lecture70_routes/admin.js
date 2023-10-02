const path = require('path');

const express = require('express');

const router = express.Router();

// /admin/add-product => GET
router.get('/add-product', (req, res, next) => {
    //console.log('In another middleware!');
    //send allows us to send a response to the client
    res.sendFile(path.join(__dirname,'..','lecture70_views','add-product.html'));
});

//app.use: this will do both get and post requests
//app.get: this will do only get requests
// /admin/add-product => POST
router.post('/add-product', (req, res, next) => {
    console.log(req.body);
    res.redirect('/');
});

module.exports = router;