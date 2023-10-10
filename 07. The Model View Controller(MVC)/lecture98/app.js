// Installing & Implementing Pug
// npm install --save pug/ejs/handlebars
// https://pugjs.org/api/getting-started.html

const path = require('path');

const express = require('express');
const expressHbs = require("express-handlebars");

const app = express();

// view engine helps express know which template engine to use
app.set("view engine", "ejs");// set the template engine to ejs
//views helps express know where to find the templates
app.set('views','views');// set the views folder to views, default is views

const adminRoutes= require('./routes/admin');
const shopRoutes = require('./routes/shop');

// register a parser for incoming requests that have a JSON body
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname,'public')));

app.use('/admin',adminRoutes);
app.use(shopRoutes);

app.use((req, res, next) => {
    //res.status(404).sendFile(path.join(__dirname,'views','404.html'));
    res.status(404).render('404',{
        pageTitle: 'Page Not Found',
        path: req.url,
        layout: false});
});
//console.log('Listening on port 3000');

app.listen(3000);