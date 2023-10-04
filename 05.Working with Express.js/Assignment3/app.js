const express = require('express');
const app = express();
const path = require('path');

const users = require('./routes/users');
const home = require('./routes/home');

app.use(express.urlencoded({extended: true})); // register a parser for incoming requests that have a JSON body
app.use(express.static(path.join(__dirname,'public')));// serve static files such as images, CSS files, and JavaScript files

app.use(home);
app.use(users);


app.use((req, res, next) => {
    res.status(404).sendFile(path.join(__dirname,'views','404.html'));
});

app.listen(3000);




