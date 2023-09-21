const express = require('express');

const app = express();


app.use('/users', (req, res, next) => {
    console.log('In another middleware!');
    //send allows us to send a response to the client
    res.send('<h1>The "Users" Page</h1>');
    //we dont use next() here because we dont want to continue to the next middleware
    //sending more than one response will result in an error
});

// we need to put this middleware at the end because it will catch all requests
// if we put it at the beginning, it will catch all requests(match "/") and the other middlewares will not be executed
app.use('/', (req, res, next) => {
    //console.log('This always runs!');
    res.send('<h1>Hello from Express!</h1>');
});

app.listen(3000);
