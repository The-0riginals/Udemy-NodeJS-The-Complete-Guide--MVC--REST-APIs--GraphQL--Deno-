const express = require('express');
//const bodyParser = require('body-parser');

const app = express();

// register a parser for incoming requests that have a JSON body
app.use(express.urlencoded({extended: true}));

app.use((req, res, next) => {
    console.log(`Received a ${req.method} request to ${req.url}`);
    next();
});

app.use('/add-product', (req, res, next) => {
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
app.post('/product', (req, res, next) => {
    console.log(req.body);
    res.redirect('/');
});

app.use('/', (req, res, next) => {
    //console.log('In another middleware!');
    //send allows us to send a response to the client
    res.send('<h1>Hello from Express!</h1>');
});

app.listen(3000);