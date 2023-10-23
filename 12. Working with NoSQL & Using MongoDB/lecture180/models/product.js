const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;


class Product {
    constructor(title, price, description, imageUrl, id) {
        this.title = title;
        this.price = price;
        this.description = description;
        this.imageUrl = imageUrl;
        this._id = id ? new mongodb.ObjectId(id) : null;//this is how we create an object id in mongodb
        //this._id = id
    }

    save() {
        const db = getDb();
        let dbOp;
        if (this._id) {
            //update the product
            dbOp = db.collection('products')
            .updateOne({_id: this._id}, {$set: this});
        } else {
            dbOp = db.collection('products')
            .insertOne(this);
        }
        return dbOp
        .then(result => {
            console.log(result);
        })
        .catch(err => {
            console.log(err);
        });
    }

    static fetchAll() {
        const db = getDb();
        return db.collection('products')
        .find()// this will return a cursor(pointer) to the documents
        .toArray()
        .then(products => {
            console.log(products);
            return products;
        })
        .catch(err => {
            console.log(err);
        });
    }

    // static findById(prodId) {
    //     const db = getDb();
    //     return db.collection('products')
    //     .find({_id: new mongodb.ObjectId(prodId)})
    //     .next()//cursor.next() returns a Promise that resolves to the next entry the cursor is pointing to
    //     .then(product => {
    //         console.log(product);
    //         return product;
    //     })
    //     .catch(err => {
    //         console.log(err);
    //     });
    // }
    static findById(productId) {
        const db = getDb();
        return (async () => {
          const collection = await db.collection('products');
          const cursor = await collection.find({ _id: new mongodb.ObjectId(productId) });//in mongodb, _id is an object(bson type) instead of a string or a number
          //console.log(await cursor.next()); //product output, should be returned here!
          //console.log(await cursor.next()); // null, because no more data in the cursor!
          // above two lines are same as this:-
          //cursor.next().then(result => { console.log(result) });
          const product = await cursor.next();
          return product; // Return the product object!
        })();
    }

    static deleteById(prodId) {
        const db = getDb();
        return db.collection('products')
        .deleteOne({_id: new mongodb.ObjectId(prodId)})
        .then(result => {
            console.log('Deleted');
        })
        .catch(err => {
            console.log(err);
        });
    }
}

module.exports = Product;