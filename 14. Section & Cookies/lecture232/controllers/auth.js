exports.getLogin = (req, res, next) => {
    const isLoggedIn = req.get('Cookie').split(';')[1].trim().split('=')[1] === 'true';//this is the old way to get the cookie
    //console.log(req.get('Cookie'));
    console.log(req.session.isLoggedIn);//this is a session cookie
    res.render('auth/login', {
        pageTitle: 'Login',
        path: '/login',
        isAuthenticated: isLoggedIn
    });
};

exports.postLogin = (req, res, next) => {
    req.session.isLoggedIn = true;//this is a session cookie
    res.setHeader('Set-Cookie','loggedIn=true');// cookie helps us to store data on the client side
    //res.setHeader('Set-Cookie','loggedIn=true; Max-Age=10');// Max-Age is the time in seconds that the cookie will be stored
    res.redirect('/');
}
