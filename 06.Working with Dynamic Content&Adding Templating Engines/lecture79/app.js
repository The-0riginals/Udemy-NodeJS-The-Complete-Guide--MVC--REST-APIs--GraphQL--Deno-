//sharing data across requests and users

const path = require('path');

const express = require('express');

const app = express();

//const adminRoutes = require('./routes/admin');
const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');

// register a parser for incoming requests that have a JSON body
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname,'public')));

//app.use('/admin',adminRoutes);
app.use('/admin',adminData.routes);
app.use(shopRoutes);

app.use((req, res, next) => {
    res.status(404).sendFile(path.join(__dirname,'views','404.html'));
});

app.listen(3000);