const express = require('express');
const app = express();
const path = require('path');

const usersRoutes = require('./routes/users');
const homeRoutes = require('./routes/home');

app.set('view engine', 'ejs'); // register the template engine
app.set('views', 'views'); // register the views folder

app.use(express.urlencoded({extended: true})); // register a parser for incoming requests that have a JSON body
app.use(express.static(path.join(__dirname,'public')));// serve static files such as images, CSS files, and JavaScript files

app.use(homeRoutes);
app.use(usersRoutes.routes);


app.use((req, res, next) => {
    res.status(404).render('404',{
        pageTitle: 'Page Not Found',
        path: req.url,
        layout: false
    });
});

app.listen(3000);




