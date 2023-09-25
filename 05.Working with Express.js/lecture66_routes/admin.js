const express = require('express');

const router = express.Router();

router.get('/add-product', (req, res, next) => {
    //console.log('In another middleware!');
    //send allows us to send a response to the client
    res.send(`
    <html>
        <head>
            <title>Add Product</title>
        </head>
        <body>
            <form action="/product" method="POST">
                <input type="text" name="title">
                <button type="submit">Add Product</button>
            </form>
        </body>
    </html>`);
});

//app.use: this will do both get and post requests
//app.get: this will do only get requests
router.post('/product', (req, res, next) => {
    console.log(req.body);
    res.redirect('/');
});

module.exports = router;