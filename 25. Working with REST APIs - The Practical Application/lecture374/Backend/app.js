const path = require('path');

const express = require('express');
const mongoose = require('mongoose');

const keys = require('./configs/key.dev');
const feedRoutes = require('./routes/feed');

const app = express();

//app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
app.use(express.json()); // application/json
//app.use(bodyParser.json()); // application/json

app.use(express.urlencoded({ extended: true })); // x-www-form-urlencoded <form>- the default data format for forms
app.use(express.json()); // application/json - the default data format for json

app.use('/images', express.static(path.join(__dirname, 'images'))); // serve images statically
// CORS error handling
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // * means any domain can access this server
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE'); // which http methods can be used
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // which headers can be used
    next();
});

app.use('/feed', feedRoutes);

// error handling middleware
app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500; // if there is no statusCode, use 500
    const message = error.message;
    res.status(status).json({ message: message });
});

mongoose.connect(
    keys.MONGODB_URL, 
    { useNewUrlParser: true, useUnifiedTopology: true }
    )
    .then(result => {
        app.listen(8080, () => {
            console.log('Server started on port 8080');
        });
    })
    .catch(err => {
        console.log(err);
    });
