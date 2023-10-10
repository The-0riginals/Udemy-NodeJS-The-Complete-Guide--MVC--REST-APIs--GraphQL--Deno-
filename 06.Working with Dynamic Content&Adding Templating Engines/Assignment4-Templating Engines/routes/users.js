const e = require('express');
const express = require('express');
const router = express.Router();

const users = [];

router.get('/users', (req, res, next) => {
    res.render('users', {
        pageTitle: 'Users',
        path: '/users',
        users: users
    });
});

exports.routes = router;
exports.users = users;