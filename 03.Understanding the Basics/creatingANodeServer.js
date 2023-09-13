const http = require('http');

//req is the request object
//res is the response object
const server = http.createServer((req, res) => {
    console.log(req.url,"//end url \n", req.method," //end method \n", req.headers);
    //process.exit(); // this is to exit the event loop
    res.setHeader('Content-Type', 'text/html'); // this is to set the header of the response that all content is html
    res.write('<html>');
    res.write('<head><title>My First Page</title></head>');
    res.write('<body><h1>Hello from my node.js server!</h1></body>');
    res.write('</html>');
    res.end(); // this is to end the response
    
});

server.listen(3000); // this is a port number