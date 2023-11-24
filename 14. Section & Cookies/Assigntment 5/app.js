const path = require('path');
const mongoose = require('mongoose');

const express = require('express');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const errorController = require('./controllers/error');
const User = require('./models/user');

const MONGODB_URI = "mongodb+srv://Klaus:19001009@cluster0.lw7vbw4.mongodb.net/shop";

const app = express();
const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions'
});

// view engine helps express know which template engine to use
app.set("view engine", "ejs");// set the template engine to ejs
//views helps express know where to find the templates
app.set('views','views');// set the views folder to views, default is views


const adminRoutes= require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');




// register a parser for incoming requests that have a JSON body
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname,'public')));
app.use(
    session({
        secret: 'my secret', 
        resave: false, 
        saveUninitialized: false, 
        store: store
    })
);

app.use('/admin',adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.use(errorController.get404);

mongoose.connect(
        MONGODB_URI,
        { useNewUrlParser: true, useUnifiedTopology: true }
    )
    .then(result => {
        User.findOne().then(user => {
            if(!user){
                const user = new User({
                    name: 'Klaus',
                    email: 'klaus@gmail.com',
                    cart: {
                        items: []
                    }
                });
                user.save();
            }
        });
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    });






