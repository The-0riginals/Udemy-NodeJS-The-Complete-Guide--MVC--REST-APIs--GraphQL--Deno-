const bcrypt = require('bcryptjs');
const nodeMailer = require('nodemailer');
const keys = require('../configs/keys.dev');
const User = require('../models/user');
const crypto = require('crypto');

const transporter = nodeMailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    auth: {
        user: keys.USER_GMAIL,
        pass: keys.PASS_GMAIL
    }
});
//console.log(keys.USER_GMAIL);
//console.log(keys.PASS_GMAIL);

exports.getLogin = (req, res, next) => {
    let message = req.flash('error');//this will return an array of all the error messages,'error' is the key that we used in req.flash('error', 'Invalid email or password.');
    if(message.length > 0){
        message = message[0];
    }else{
        message = null;
    }
    res.render('auth/login', {
        pageTitle: 'Login',
        path: '/login',
        errorMessage: message
    });
};

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({email: email})
        .then(user => {
            if(!user){
                req.flash('error', 'Invalid email or password.');
                return res.redirect('/login');
            }
            bcrypt.compare(password, user.password)
                .then(doMatch => {
                    if(doMatch){
                        req.session.isLoggedIn = true;//this is a session cookie
                        req.session.user = user;//this is a session cookie
                        return req.session.save(err => { //make sure that the session is saved before redirecting
                            console.log(err);
                            res.redirect('/');
                        });
                    }
                    req.flash('error', 'Invalid email or password.');
                    res.redirect('/login');
                })
                .catch(err => {
                    console.log(err);
                    res.redirect('/login');
                });
        })
        .catch(err => {
            console.log(err);
        });
};

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => { //this will delete the session from the database
        console.log(err);
        res.redirect('/');
    });
}

exports.getSignup = (req, res, next) => {
    let message = req.flash('error');//this will return an array of all the error messages,'error' is the key that we used in req.flash('error', 'Invalid message.');
    if(message.length > 0){
        message = message[0];
    }else{
        message = null;
    }
    res.render('auth/signup', {
        pageTitle: 'Signup',
        path: '/signup',
        errorMessage: message
    });
}

exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    User.findOne({email: email})
        .then(userDoc => {
            if(userDoc){
                req.flash('error', 'Email already exists, please pick a different one');
                return res.redirect('/signup');
            }
            return bcrypt
                .hash(password, 12)// 12 is the number of rounds that the password will be hashed
                .then(hashedPassword => {
                    const user = new User({
                        email: email,
                        password: hashedPassword,
                        cart: {items: []}
                    });
                    return user.save();
                })
                .then(result => {
                    res.redirect('/login');
                    return transporter.sendMail({
                        to: email,
                        from: keys.USER_GMAIL,
                        subject: 'Signup succeeded',
                        html: '<h1>You successfully signed up!</h1>'
                    });
                })
                .catch(err => {
                    console.log(err);
                });

        })
        .catch(err => {
            console.log(err);
        });
};

exports.getReset = (req, res, next) => {
    let message = req.flash('error');//this will return an array of all the error messages,'error' is the key that we used in req.flash('error', 'Invalid message.');
    if(message.length > 0){
        message = message[0];
    }else{
        message = null;
    }
    res.render('auth/reset', {
        pageTitle: 'Reset Password',
        path: '/reset',
        errorMessage: message
    });
}

exports.postReset = (req, res, next) => {
    crypto.randomBytes(32, (err, buffer) => { //generate a random token
        if(err){
            console.log(err);
            return res.redirect('/reset');
        }
        const token = buffer.toString('hex');//convert the random token to a string
        User.findOne({email: req.body.email})
            .then(user => {
                if(!user){
                    req.flash('error', 'No account with that email found.');
                    return res.redirect('/reset');
                }
                user.resetToken = token;
                user.resetTokenExpiration = Date.now() + 3600000;//1 hour
                return user.save();
            })
            .then(result => {
                res.redirect('/');
                transporter.sendMail({
                    to: req.body.email,
                    from: keys.USER_GMAIL,
                    subject: 'Password reset',
                    html: `
                        <p>You requested a password reset</p>
                        <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password</p>
                    `
                });
            })
            .catch(err => {
                console.log(err);
            });
    });
}

exports.getNewPassword = (req, res, next) => {
    const token = req.params.token;
    User.findOne({resetToken: token, resetTokenExpiration: {$gt: Date.now()}})//$gt is a mongodb operator that means greater than
        .then(user => {
            let message = req.flash('error');//this will return an array of all the error messages,'error' is the key that we used in req.flash('error', 'Invalid message.');
            if(message.length > 0){
                message = message[0];
            }else{
                message = null;
            }
            res.render('auth/new-password', {
                pageTitle: 'New Password',
                path: '/new-password',
                errorMessage: message,
                userId: user._id.toString(),//we need to convert the user id to string because (primitive and reference types stuff)
                passwordToken: token
            });
        })
        .catch(err => {
            console.log(err);
        });
}

exports.postNewPassword = (req, res, next) => {
    const newPassword = req.body.password;
    const userId = req.body.userId;//we need to convert the user id to string because (primitive and reference types stuff)
    const passwordToken = req.body.passwordToken;
    let resetUser;
    User.findOne({resetToken: passwordToken, resetTokenExpiration: {$gt: Date.now()}, _id: userId})//$gt is a mongodb operator that means greater than
        .then(user => {
            resetUser = user;
            return bcrypt.hash(newPassword, 12);
        })
        .then(hashedPassword => {
            resetUser.password = hashedPassword;//update the user password
            resetUser.resetToken = undefined;//delete the reset token
            resetUser.resetTokenExpiration = undefined;//delete the reset token expiration
            return resetUser.save();
        })
        .then(result => {
            res.redirect('/login');
        })
        .catch(err => {
            console.log(err);
        });
}