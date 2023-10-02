const path = require('path');

const express = require('express');

const app = express();

const adminRoutes = require('./lecture75_routes/admin');
const shopRoutes = require('./lecture75_routes/shop');

// register a parser for incoming requests that have a JSON body
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname,'lecture75_public')));

app.use('/admin',adminRoutes);
app.use(shopRoutes);

app.use((req, res, next) => {
    res.status(404).sendFile(path.join(__dirname,'lecture70_views','404.html'));
});

app.listen(3000);