exports.get404 = (req, res, next) => {
    //res.status(404).sendFile(path.join(__dirname,'views','404.html'));
    res.status(404).render('404',{
        pageTitle: 'Page Not Found',
        path: req.url,
        layout: false,
        isAuthenticated: req.session.isLoggedIn
    });
}

exports.get404 = (req, res, next) => {
    //res.status(404).sendFile(path.join(__dirname,'views','404.html'));
    res.status(500).render('500',{
        pageTitle: 'Page Not Found',
        path: req.url,
        layout: false,
        isAuthenticated: req.session.isLoggedIn
    });
}