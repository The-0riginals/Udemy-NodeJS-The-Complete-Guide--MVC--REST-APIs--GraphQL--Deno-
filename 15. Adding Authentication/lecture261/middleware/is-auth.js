module.exports = (req, res, next) => {
    if(!req.session.isLoggedIn){
        return res.redirect('/login');
    }
    next();
    //eg: router.get('/add-product',isAuth, adminController.getAddProduct);
    //here next() will call adminController.getAddProduct
}
