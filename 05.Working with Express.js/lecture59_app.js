//const http = require('http');

const express = require('express');

const app = express();

//The browser should try to load a favicon only the first time after a reload of the page (if it has not already cached one).
// After that, the browser will not send a request for the favicon again until the browser cache is cleared.
app.get('/favicon.ico', (req, res) => res.status(204));
// if we dont add this route, the browser will try to load a favicon.ico file from the root of our server
//ouput: In the middleware! In another middleware! x2

//use is a special function provided by express. It allows us to add a new middleware function
//next is a function that will be passed to the middleware function by express. It will be called by express when the middleware function is done executing.
app.use((req, res, next) => {
    console.log('In the middleware!');
    //next allows the request to continue to the next middleware in line
    next();
});

app.use((req, res, next) => {
    console.log('In another middleware!');
    //send allows us to send a response to the client
    res.send('<h1>Hello from Express!</h1>');
});


// const server = http.createServer(app);
// server.listen(3000);

//we can also use the listen method provided by express
app.listen(3000);
