const fs = require('fs');
const path = require('path');

const { validationResult } = require('express-validator');

const Post = require('../models/post');

exports.getPosts = (req, res, next) => {
    Post.find()
    .then(posts => {
        res.status(200)
            .json({
                message: 'Fetched posts successfully.', 
                posts: posts
            });
    })
    .catch(err => {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    });
};

exports.createPost = (req, res, next) => {
    const errors = validationResult(req);//this will check if there are any errors in the validation chain
    console.log("this is the req.file:",req.file);
    if(!errors.isEmpty()){//if there are errors
        const error = new Error('Validation failed, entered data is incorrect.');
        error.statusCode = 422;//422 means validation failed
        throw error;
    }
    if(!req.file){//if there is no file
        const error = new Error('No image provided.');
        error.statusCode = 422;//422 means validation failed
        throw error;
    }

    const imageUrl = req.file.path.replace("\\","/");//this is the path of the image


    const title = req.body.title;
    const content = req.body.content;
    const post = new Post({//dont need to specify _id and createAT because mongoose will automatically add it
        title: title,
        content: content,
        imageUrl: imageUrl,
        creator: {
            name: 'Maximilian'
        }
    });
    console.log("this is the post:",post);
    post.save()
    .then(result => {
        console.log(result);
        res.status(201).json({
            message: 'Post created successfully!',
            post: result
        });
    })
    .catch(err => {
        //console.log(err);
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);//this will forward the error to the next middleware
    });

};

exports.getPost = (req, res, next) => {
    const postId = req.params.postId;
    Post.findById(postId)//findById is a mongoose method
    .then(post => {
        if(!post){
            const error = new Error('Could not find post.');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({message: 'Post fetched.', post: post});
    })
    .catch(err => {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    });
};

exports.updatePost = (req, res, next) => {
    const postId = req.params.postId;
    const errors = validationResult(req);//this will check if there are any errors in the validation chain
    if(!errors.isEmpty()){//if there are errors
        const error = new Error('Validation failed, entered data is incorrect.');
        error.statusCode = 422;//422 means validation failed
        throw error;
    }
    const title = req.body.title;
    const content = req.body.content;
    let imageUrl = req.body.image;//this is the path of the image
    if(req.file){
        imageUrl = req.file.path.replace("\\","/");//this is the path of the image
    }
    if(!imageUrl){
        const error = new Error('No file picked.');
        error.statusCode = 422;//422 means validation failed
        throw error;
    }
    //update the post in the database
    Post.findById(postId)//findById is a mongoose method
    .then(post => {
        if(!post){
            const error = new Error('Could not find post.');
            error.statusCode = 404;
            throw error;
        }
        if(imageUrl !== post.imageUrl){
            clearImage(post.imageUrl);//this will delete the old image
        }
        post.title = title;
        post.imageUrl = imageUrl;
        post.content = content;
        return post.save();
    })
    .then(result => {
        res.status(200).json({message: 'Post updated!', post: result});
    })
    .catch(err => {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    });
};

const clearImage = filePath => {
    filePath = path.join(__dirname, '..', filePath);//this will go to the parent folder of the current folder
    fs.unlink(filePath, err => console.log(err));//this will delete the file
};

exports.deletePost = (req, res, next) => {
    const postId = req.params.postId;
    Post.findById(postId)//findById is a mongoose method
    .then(post => {
        if(!post){
            const error = new Error('Could not find post.');
            error.statusCode = 404;
            throw error;
        }
        //check logged in user
        clearImage(post.imageUrl);//this will delete the old image
        return Post.findByIdAndDelete(postId);//this will delete the post
    })
    .then(result => {
        console.log(result);
        res.status(200).json({message: 'Deleted post.'});
    })
    .catch(err => {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    });
};

