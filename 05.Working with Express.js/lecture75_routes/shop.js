const path = require('path');

const express = require('express');

const rootDir = require('../lecture73_util/path');

const router = express.Router();

router.get('/', (req, res, next) => {
    res.sendFile(path.join(rootDir,'lecture75_views','shop.html'));
}
);

module.exports = router;
