const express = require('express');

const app = express();

app.use('/', (req, res, next) => {
    console.log('This always runs!');
    next();
});

app.use('/add-product', (req, res, next) => {
    console.log('In another middleware!');
    //send allows us to send a response to the client
    res.send('<h1>The "Add Product" Page</h1>');
    //we dont use next() here because we dont want to continue to the next middleware
    //sending more than one response will result in an error
});

app.use('/', (req, res, next) => {
    console.log('In another middleware!');
    //send allows us to send a response to the client
    res.send('<h1>Hello from Express!</h1>');
});

app.listen(3000);
