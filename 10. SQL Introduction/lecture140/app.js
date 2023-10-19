// Installing & Implementing Pug
// npm install --save pug/ejs/handlebars

const path = require('path');

const express = require('express');
const db = require('./util/database');

const app = express();

// view engine helps express know which template engine to use
app.set("view engine", "ejs");// set the template engine to ejs
//views helps express know where to find the templates
app.set('views','views');// set the views folder to views, default is views

const errorController = require('./controllers/error');
const adminRoutes= require('./routes/admin');
const shopRoutes = require('./routes/shop');
//const e = require('express');

// promise is js object that holds the eventual result of an asynchronous operation
// it allows us to register functions that should execute when the promise is done
// db.execute('SELECT * FROM products')
//     .then(result => {
//         console.log(result[0],result[1]);
//     })
//     .catch(err => {
//         console.log(err);
//     });


// register a parser for incoming requests that have a JSON body
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname,'public')));

app.use('/admin',adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);
//console.log('Listening on port 3000');

app.listen(3000);