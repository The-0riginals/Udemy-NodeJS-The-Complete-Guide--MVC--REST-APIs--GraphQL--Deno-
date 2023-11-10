const path = require('path');
const mongoose = require('mongoose');

const express = require('express');
const errorController = require('./controllers/error');
const User = require('./models/user');

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

//middleware to add a user to the request
//this middleware will run for every incoming request 
//it means that it will only execute if we finished the sync process
app.use((req,res,next) => {
    User.findById("6536eb4a3481b5e8c4d1c279")
    .then(user => {
        req.user =  new User(user.name, user.email, user.cart, user._id);//this is a mongoose object
        next();//this will allow the request to continue cuz this is a middleware
    })
    .catch(err => console.log(err));
});

app.use('/admin',adminRoutes);
app.use(shopRoutes);
app.use(errorController.get404);

mongoose.connect(
        "mongodb+srv://Klaus:19001009@cluster0.lw7vbw4.mongodb.net/shop?retryWrites=true",
        { useNewUrlParser: true, useUnifiedTopology: true }
    )
    .then(result => {
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    });






