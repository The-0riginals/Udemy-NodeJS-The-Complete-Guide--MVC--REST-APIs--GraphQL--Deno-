const express = require('express');

const app = express();

const adminRoutes = require('./lecture66_routes/admin');
const shopRoutes = require('./lecture66_routes/shop');

// register a parser for incoming requests that have a JSON body
app.use(express.urlencoded({extended: true}));

app.use(adminRoutes);
app.use(shopRoutes);

app.use((req, res, next) => {
    //console.log('In another middleware!');
    //send allows us to send a response to the client
    res.status(404).send('<h1>Page not found</h1>');
});

app.listen(3000);