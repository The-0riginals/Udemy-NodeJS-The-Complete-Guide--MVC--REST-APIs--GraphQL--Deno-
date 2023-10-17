const e = require('express');
const fs = require('fs');
const { get } = require('http');
const path = require('path');

const Cart = require('./cart');
//helper function
//path 'p' to the file where we want to store our data
const p = path.join(
    path.dirname(require.main.filename),
    'data',
    'products.json'
);

const getProductsFromFile = (cb) => {
    fs.readFile(p, (err, fileContent) => {
        if (err) {
            cb([]); // callback function
        } else {
            cb(JSON.parse(fileContent)); // convert JSON string into a JS object
        }
    });
}

module.exports = class Product {
    constructor(id, title, imageUrl, description, price) {
        this.id = id; // if id is undefined, it will be generated in the save() method
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    save() { // a function that will be added to any instantiated object of this class
        //this.id = Math.random().toString(); // generate a random id
        getProductsFromFile(products => {
            if (this.id) { // if the id is not undefined
                const existingProductIndex = products.findIndex(prod => prod.id === this.id);
                const updatedProducts = [...products];
                updatedProducts[existingProductIndex] = this;
                fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
                    console.log(err);
                });
            } else { // if the id is undefined
                this.id = Math.random().toString();
                products.push(this);
                fs.writeFile(p, JSON.stringify(products), (err) => {
                    console.log(err);
                });
            }
        });
    }

    static deleteById(id) {
        getProductsFromFile(products => {
            const product = products.find(prod => prod.id === id);
            const updatedProducts = products.filter(prod => prod.id !== id);
            fs.writeFile(p, JSON.stringify(updatedProducts), err => {
                if (!err) {
                    // delete the product from the cart
                    Cart.deleteProduct(id, product.price);
                }
            });
        });
    }

    // static keyword is used to create a method that can be called directly on the class itself
    // and not on the instantiated object
    static fetchAll(cb) {
        getProductsFromFile(cb);
    }

    static findById(id, cb) {
        getProductsFromFile(products => {
            const product = products.find(p => p.id === id);
            cb(product);
        });
    }
}
// callback function:
// when we try to use Product.fetchAll(products => {..))
// this callback function:'products => {..}' will be wait and executed once the file reading is done
// and we have the content of the file


// another example to write the callback function:
/*
async foo (a, b) {
    return a + b;
}
const sum = async () => {
    const ans = await foo(a,b); // this will ensure that the code executes forward only when   

    //response comes inside the ans.

    console.log(ans);
}*/