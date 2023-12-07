const { validationResult } = require('express-validator');

const Post = require('../models/post');

exports.getPosts = (req, res, next) => {
    res.status(200).json({
        posts: [
            {
                _id: '1',
                title: 'First Post',
                content: 'This is the first post!',
                imageUrl: 'images/1st.jpg',
                creator: {
                    name: 'Maximilian'
                },
                createdAt: new Date()
            }
        ]
    });
};

exports.createPost = (req, res, next) => {
    const errors = validationResult(req);//this will check if there are any errors in the validation chain
    if(!errors.isEmpty()){//if there are errors
        const error = new Error('Validation failed, entered data is incorrect.');
        error.statusCode = 422;//422 means validation failed
        throw error;
    }
    const title = req.body.title;
    const content = req.body.content;
    const post = new Post({//dont need to specify _id and createAT because mongoose will automatically add it
        title: title,
        content: content,
        imageUrl: 'images/1st.jpg',
        creator: {
            name: 'Maximilian'
        }
    });
    post.save()
    .then(result => {
        // console.log(result);
        res.status(201).json({
            message: 'Post created successfully!',
            post: result
        });
    })
    .catch(err => {
        // console.log(err);
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);//this will forward the error to the next middleware
    });

};

