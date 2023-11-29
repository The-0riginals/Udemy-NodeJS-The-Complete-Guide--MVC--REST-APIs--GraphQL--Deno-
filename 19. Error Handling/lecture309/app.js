const path = require('path');
const mongoose = require('mongoose');

const express = require('express');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
var cookieParser = require('cookie-parser')
const flash = require('connect-flash');

const errorController = require('./controllers/error');
const User = require('./models/user');


const MONGODB_URI = "mongodb+srv://Klaus:19001009@cluster0.lw7vbw4.mongodb.net/shop";

const app = express();

const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions'
});
// setup route middlewares
const csrfProtection = csrf({ cookie: true });
app.use(cookieParser())// parse cookies
// we need this because "cookie" is true in csrfProtection

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
app.use(csrfProtection);//this middleware must be registered after the session middleware
app.use(flash());// flash helps us to store messages in the session and only display them once

//this middleware will be executed for every incoming request
//this middleware will add a local variable to the response object which will be passed to the views
app.use((req,res,next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
});


//session only fetch the data not the user object with methods provided by mongoose
//we need to fetch the user object with the methods provided by mongoose
//we need to use the user object in the request
//we can use a middleware to do this
app.use((req,res,next) => {
    if(!req.session.user){
        return next();
    }
    User.findById(req.session.user._id)
        .then(user => {
            if(!user){
                return next();
            }
            req.user = user;//this is a mongoose object model(with methods provided by mongoose)
            next();
        })
        .catch(err => { 
            //throw new Error(err);// throw will not work here because this is an async code, we will not reach the error handling middleware
            next(new Error(err));//this will skip all the other middlewares and go to the error handling middleware
        });
});




app.use('/admin',adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.get(errorController.get500);
app.use(errorController.get404);

app.use((error,req,res,next) => {
    //res.status(error.httpStatusCode).render(...);
    //res.redirect('/500');
    res.status(500).render('500',{
        pageTitle: 'Error!',
        path: '/500',
        layout: false,
        isAuthenticated: req.session.isLoggedIn
    });
});

mongoose.connect(
        MONGODB_URI,
        { useNewUrlParser: true, useUnifiedTopology: true }
    )
    .then(result => {
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    });






