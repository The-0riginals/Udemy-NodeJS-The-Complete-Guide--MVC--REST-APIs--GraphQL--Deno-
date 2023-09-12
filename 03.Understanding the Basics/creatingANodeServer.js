const http = require('http');

//req is the request object
//res is the response object
const server = http.createServer((req, res) => {
    console.log(req);
    //process.exit(); // this is to exit the event loop
});

server.listen(3000); // this is a port number