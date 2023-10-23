const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;

// user have only one cart so we don't need to create a new collection for it
// we can add a cart property to the user collection
class User {
    constructor(username, email, cart, id){
        this.name = username;
        this.email = email;
        this.cart = cart ? cart : cart = {items: []}// if cart is null then create a new cart
        this._id = id; // received user id from mongodb
    }

    save() {
        const db = getDb();
        return db.collection('users')
        .insertOne(this)
        .then(result => {
            console.log(result);
        })
        .catch(err => {
            console.log(err);
        });
    }

    addToCart(product) {
        const cartProductIndex = this.cart.items.findIndex(cp => {
            return cp.productId.toString() === product._id.toString();
            // we need to convert the product id to string because (primitive and reference types stuff)
            // in this case we have two different objects(reference types) with the same value and type
            //https://www.udemy.com/course/nodejs-the-complete-guide/learn/lecture/11942824#questions/18603786
        });

        let newQuantity = 1;
        const updatedCartItems = [...this.cart.items];// copy the cart items

        // if the product is already exist in the cart
        if (cartProductIndex >= 0) {
            newQuantity = this.cart.items[cartProductIndex].quantity + 1;
            updatedCartItems[cartProductIndex].quantity = newQuantity;// update the quantity of the product
        } else {// in case the product is not exist in the cart
            updatedCartItems.push({productId: new mongodb.ObjectId(product._id), quantity: newQuantity});// add the product to the cart
        }
        const updatedCart = {
            items: updatedCartItems
        };
        const db = getDb();
        return db.collection('users')
        .updateOne(
            {_id: new mongodb.ObjectId(this._id)},
            {$set: {cart: updatedCart}}
        );
    }

    getCart() {
        const db = getDb();
        const productIds = this.cart.items.map(i => {
            return i.productId;
        });
        return db.collection('products')
        .find({_id: {$in: productIds}})// $in is a mongodb operator that takes an array of values and return all the documents that have a value in that array
        .toArray()
        .then(products => { // we need to add the quantity property to the products
            return products.map(p => {
                return {
                    ...p,
                    quantity: this.cart.items.find(i => {
                    return i.productId.toString() === p._id.toString();
                }).quantity};
            });
        });
    }

    deleteItemFromCart(productId) {
        const updatedCartItems = this.cart.items.filter(item => {
            return item.productId.toString() !== productId.toString();
        });
        const db = getDb();
        return db.collection('users')
        .updateOne(
            {_id: new mongodb.ObjectId(this._id)},
            {$set: {cart: {items: updatedCartItems}}}
        );
    }

    addOrder() {
        const db = getDb();
        return this.getCart()
        .then(products => {
            const order = {
                items: products,
                user: {
                    _id: new mongodb.ObjectId(this._id),
                    name: this.name
                }
            };
            return db.collection('orders')
            .insertOne(order);
        })
        .then(result => {
            this.cart = {items: []};
            return db.collection('users')
            .updateOne(
                {_id: new mongodb.ObjectId(this._id)},
                {$set: {cart: {items: []}}}
            );
        });
    }

    getOrders() {
        const db = getDb();
        return db.collection('orders')
        .find({'user._id': new mongodb.ObjectId(this._id)})
        .toArray();
    }

    static findById(userId) {
        const db = getDb();
        return db.collection('users')
        .find({_id: new mongodb.ObjectId(userId)})
        .next()
        .then(user => {
            console.log(user);
            return user;
        })
        .catch(err => {
            console.log(err);
        });
    }
}

module.exports = User;