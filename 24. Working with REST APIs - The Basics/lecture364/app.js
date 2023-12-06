const express = require('express');

const feedRoutes = require('./routes/feed');

const app = express();

//app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
app.use(express.json()); // application/json
//app.use(bodyParser.json()); // application/json

app.use(express.urlencoded({ extended: true })); // x-www-form-urlencoded <form>- the default data format for forms
app.use(express.json()); // application/json - the default data format for json

// CORS error handling
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // * means any domain can access this server
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE'); // which http methods can be used
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // which headers can be used
    next();
});

app.use('/feed', feedRoutes);


app.listen(8080, () => {
    console.log('Server started on port 8080');
}
);