const express = require('express');
const { check, body } = require('express-validator');//this is a function that returns a middleware

const router = express.Router();

const authController = require('../controllers/auth');
const User = require('../models/user');

router.get('/login', authController.getLogin);

router.post('/login',
    [
        body('email')
            .isEmail()
            .withMessage('please enter a valid email')
            .normalizeEmail(),
        body('password', 'Password has to be valid.')
            .isLength({min: 3})
            .isAlphanumeric()
            .trim()//trim() removes white spaces
    ],
    authController.postLogin
);

router.post('/logout', authController.postLogout);

router.get('/signup', authController.getSignup);

router.post('/signup',
    [
        check('email')
            .isEmail()
            .withMessage('please enter a valid email')
            .custom((value, {req}) => {
                // if(value === 'test@test.com'){
                //     throw new Error('forbidden email.');
                // }
                // return true;//this is important to return true if the validation succeeds
                return User.findOne({email: value})
                    .then(userDoc => {
                        if(userDoc){
                            return Promise.reject('Email already exists, please pick a different one');// promise.reject() is a function provided by mongoose
                        }
                    }
                );
            })
            .normalizeEmail(),

        body('password', 'Please enter a password with only numbers and text and at least 5 characters.')//this is a custom error message for every validation
            .isLength({min: 3})
            .isAlphanumeric() //only letters and numbers
            .trim(),
        body('confirmPassword')//'confirmPassword' is the name of the input field
            .trim()
            .custom((value, {req}) => {
                if(value !== req.body.password){
                    throw new Error('Passwords have to match!');
                }
                return true;//this is important to return true if the validation succeeds
            })

    ],
    authController.postSignup
);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);

module.exports = router;
