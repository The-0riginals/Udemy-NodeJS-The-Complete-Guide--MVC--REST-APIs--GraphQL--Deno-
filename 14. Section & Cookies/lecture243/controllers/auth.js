const User = require('../models/user');


exports.getLogin = (req, res, next) => {
    //const isLoggedIn = req.get('Cookie').split(';')[1].trim().split('=')[1] === 'true';//this is the old way to get the cookie
    //console.log(req.get('Cookie'));
    //console.log(req.session.isLoggedIn);//this is a session cookie
    res.render('auth/login', {
        pageTitle: 'Login',
        path: '/login',
        isAuthenticated: false
    });
};

exports.postLogin = (req, res, next) => {
    //res.setHeader('Set-Cookie','loggedIn=true');// cookie helps us to store data on the client side
    //res.setHeader('Set-Cookie','loggedIn=true; Max-Age=10');// Max-Age is the time in seconds that the cookie will be stored
    User.findById('6556929400c763b1c6e4fc83')
        .then(user => {
            req.session.isLoggedIn = true;//this is a session cookie
            req.session.user = user;//this is a session cookie
            req.session.save(err => { //make sure that the session is saved before redirecting
                console.log(err);
                res.redirect('/');
            });
        })
        .catch(err => console.log(err));
};

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => { //this will delete the session from the database
        console.log(err);
        res.redirect('/');
    });
}

