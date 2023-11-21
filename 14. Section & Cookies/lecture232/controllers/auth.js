exports.getLogin = (req, res, next) => {
    //const isLoggedIn = req.get('Cookie').split(';')[1].trim().split('=')[1] === 'true';//this is the old way to get the cookie
    res.render('auth/login', {
        pageTitle: 'Login',
        path: '/login',
        isAuthenticated: false
    });
};

exports.postLogin = (req, res, next) => {
    //req.isLoggedIn = true;
    res.setHeader('Set-Cookie','loggedIn=true');// cookie helps us to store data on the client side
    //res.setHeader('Set-Cookie','loggedIn=true; Max-Age=10');// Max-Age is the time in seconds that the cookie will be stored
    res.redirect('/');
}
