const fs = require('fs');
const path = require('path');

const p=path.join(
    path.dirname(require.main.filename),
    'data',
    'cart.json'
);

module.exports = class Cart {
    static addProduct(id, productPrice){
        //Fetch the previous cart
        fs.readFile(p, (err, fileContent) => {
            let cart = {products: [], totalPrice: 0};
            if(!err){
                cart = JSON.parse(fileContent);
            }
            //Analyze the cart => Find existing product
            //if the product is already in the cart, we will get the index of the product
            const existingProductIndex = cart.products.findIndex(prod => prod.id === id);//findIndex() is a JS function that takes a function as an argument and that function will be executed on every element in the array and it will return true if the element fulfills the condition and false if it doesn't
            const existingProduct = cart.products[existingProductIndex];//if the product is already in the cart, we will get the product
            let updatedProduct;

            //Add new product/ increase quantity
            //here we are not modifying orignal array because we might be using refrence of this array somewhere else and changing this refrence may change other things in our app.
            if(existingProduct){//if the product is already in the cart, we will update the quantity of the product
                updatedProduct = {...existingProduct};
                updatedProduct.qty = updatedProduct.qty + 1;
                cart.products = [...cart.products];//ensure that this array can't (accidentally) be mutated from some other place in the app
                cart.products[existingProductIndex]=updatedProduct; //replace the existing product with the updated product
            }
            else{
                updatedProduct = {id: id, qty: 1};
                cart.products = [...cart.products, updatedProduct]; //add the updated product to the cart
            }

            cart.totalPrice = cart.totalPrice + +productPrice;//convert productPrice to a number by adding a plus sign in front of it
            fs.writeFile(p, JSON.stringify(cart), err => {
                console.log(err);
            });
        }
        );
    }

    static deleteProduct(id, productPrice){
        fs.readFile(p, (err, fileContent) => {
            if(err){
                return;
            }
            const updatedCart = {...JSON.parse(fileContent)};//copy the cart
            const product = updatedCart.products.find(prod => prod.id === id);
            if(!product){ //if the product is not in the cart, we will simply ignore the request
                return;
            }
            const productQty = product.qty;
            updatedCart.products = updatedCart.products.filter(
                prod => prod.id !== id
            );//filter() returns a new array with the products that is true for the condition
            updatedCart.totalPrice = updatedCart.totalPrice - productPrice * productQty;
            fs.writeFile(p, JSON.stringify(updatedCart), err => {
                console.log(err);
            });
        });
    }

    static getCart(cb){
        fs.readFile(p, (err, fileContent) => {
            const cart = JSON.parse(fileContent);
            if(err){
                cb(null);
            }
            else{
                cb(cart);
            }
        });
    }

}
