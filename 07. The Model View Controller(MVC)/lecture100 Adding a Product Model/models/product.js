const products = [];

module.exports = class Product {
    constructor(title) {
        this.title = title;
    }
    
    save() { // a function that will be added to any instantiated object of this class
        products.push(this);
    }
    
    // static keyword is used to create a method that can be called directly on the class itself
    // and not on the instantiated object
    static fetchAll() {
        return products;
    }
}
