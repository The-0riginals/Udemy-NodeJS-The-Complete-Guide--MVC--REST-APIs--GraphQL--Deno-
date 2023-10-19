const db = require('../util/database');

const Cart = require('./cart');


module.exports = class Product {
    constructor(id, title, imageUrl, description, price) {
        this.id = id; // if id is undefined, it will be generated in the save() method
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    save(){
        return db.execute('INSERT INTO products (title, price, imageUrl, description) VALUES (?, ?, ?, ?)',
            [this.title, this.price, this.imageUrl, this.description]
        );
    }

    static deleteById(id) {

    }

    // static keyword is used to create a method that can be called directly on the class itself
    // and not on the instantiated object
    static fetchAll() {
        return db.execute('SELECT * FROM products');
    }

    static findById(id) {
        return db.execute('SELECT * FROM products WHERE products.id = ?', [id]);
    }
}