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
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const OrderItem = require('./models/order-item');
const Order = require('./models/order');



// register a parser for incoming requests that have a JSON body
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname,'public')));

//middleware to add a user to the request
//this middleware will run for every incoming request 
//it means that it will only execute if we finished the sync process
app.use((req,res,next) => {
    User.findByPk(1)
    .then(user => {
        req.user = user;//this is a sequelize object
        next();//this will allow the request to continue cuz this is a middleware
    })
    .catch(err => console.log(err));
});



app.use('/admin',adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);
//console.log('Listening on port 3000');

//define the relationships between the models
Product.belongsTo(User, {constraints: true, onDelete: 'CASCADE'});//cascade means if a user is deleted, all his products will be deleted
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);//optional
Cart.belongsToMany(Product, {through: CartItem});//many to many relationship: cart can have many products and a product can be in many carts
Product.belongsToMany(Cart, {through: CartItem});//many to many relationship
//through: CartItem is the table that will be used to connect the two tables
Order.belongsTo(User);
User.hasMany(Order);
Product.belongsToMany(Order, {through: OrderItem});
Order.belongsToMany(Product, {through: OrderItem});


//sync will create the tables if they don't exist and relations
sequelize
//.sync({force: true})//force: true will drop the tables if they exist and create new ones with the new relations/associations
.sync()
.then(result => {
    return User.findByPk(1);
})
.then(user => {
    if(!user){
        return User.create({name: 'Max', email: 'test@test.com'});
    }
    return user;
})
.then(user => {
    //console.log(user);
    return user.createCart();
})
.then(cart => {
    app.listen(3000);
})
.catch(err => {
    console.log(err);
});

//app.listen(3000);