const e = require('express');
const fs = require('fs');
const { get } = require('http');
const path = require('path');

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
    constructor(title, imageUrl, description, price) {
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    save() { // a function that will be added to any instantiated object of this class
        getProductsFromFile(products => {
            products.push(this);
            fs.writeFile(p, JSON.stringify(products), (err) => {
                console.log(err);
            });
        });
    }

    // static keyword is used to create a method that can be called directly on the class itself
    // and not on the instantiated object
    static fetchAll(cb) {
        getProductsFromFile(cb);
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