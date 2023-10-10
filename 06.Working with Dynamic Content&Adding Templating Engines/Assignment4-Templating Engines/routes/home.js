const express = require('express');
const router = express.Router();
const usersData = require('./users');

router.get('/', (req, res, next) => {
    res.render('home', {
        pageTitle: 'Home',
        path: '/'
    });
});

router.post('/', (req, res, next) => {
    usersData.users.push({username: req.body.username});
    console.log(usersData.users);
    res.redirect('/users');
});

module.exports = router;
