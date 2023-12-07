const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    title:{
        type: String,
        required: true
    },
    imageUrl:{
        type: String,
        required: true
    },
    content:{
        type: String,
        required: true
    },
    creator:{
        type: Schema.Types.ObjectId,
        ref: 'User',//this is the model we want to connect to
        required: true
    }
},{timestamps: true});//this will add createdAt and updatedAt fields to the schema

module.exports = mongoose.model('Post',postSchema);
