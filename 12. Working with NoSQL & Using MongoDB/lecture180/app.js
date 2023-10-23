// Installing & Implementing Pug
// npm install --save pug/ejs/handlebars

const path = require('path');

const express = require('express');
const sequelize = require('./util/database');

const app = express();

// view engine helps express know which template engine to use
app.set("view engine", "ejs");// set the template engine to ejs
//views helps express know where to find the templates
app.set('views','views');// set the views folder to views, default is views

const errorController = require('./controllers/error');
const adminRoutes= require('./routes/admin');
const shopRoutes = require('./routes/shop');

const mongoConnect = require('./util/database').mongoConnect;



// register a parser for incoming requests that have a JSON body
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname,'public')));

//middleware to add a user to the request
//this middleware will run for every incoming request 
//it means that it will only execute if we finished the sync process
app.use((req,res,next) => {
    // User.findByPk(1)
    // .then(user => {
    //     req.user = user;//this is a sequelize object
    //     next();//this will allow the request to continue cuz this is a middleware
    // })
    // .catch(err => console.log(err));
    next();
});

app.use('/admin',adminRoutes);
app.use(shopRoutes);
app.use(errorController.get404);

mongoConnect(() => {
    app.listen(3000);
});






