const path = require('path');

const express = require('express');

const rootDir = require('../utils/path');

const router = express.Router();

router.get('/users', (req, res, next) => {
    res.sendFile(path.join(rootDir,'views','users.html'));
});

// load users.json from folder public
//const users = require('../public/users.json');


// send users to users.html
// router.get('/users', (req, res, next) => {
//     res.render('users', {users: users});
// });


module.exports = router;

