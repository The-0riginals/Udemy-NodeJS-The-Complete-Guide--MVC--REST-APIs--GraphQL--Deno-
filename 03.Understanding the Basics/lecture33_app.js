const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
    const url = req.url;
    const method = req.method; // this is to get the method of the request
    if(url === '/'){
        res.write('<html>');
        res.write('<head><title>Enter Message</title></head>');
        res.write(`
        <body>
        <form action="/message" method="POST">
            <input type="text">
                <button type="submit">Send</button>
        </form>
        </body>`
        );
        res.write('</html>');
        return res.end(); // this is to end the response
    }
    if (url === '/message' && method === 'POST') {
        fs.writeFileSync('lecture33_message.txt', 'DUMMY');
        res.statusCode = 302; // this is to set the status code
        res.setHeader('Location', '/'); // this is to set the header back to /
        //It's what tells the browser to perform a re-direct. Once the response is sent, 
        //the browser will read the response and see a 302 status code, it then knows it has to initiate another request to the re-direction URL specified
        return res.end();
    }

    res.setHeader('Content-Type', 'text/html'); // this is to set the header of the response that all content is html
    res.write('<html>');
    res.write('<head><title>My First Page</title></head>');
    res.write('<body><h1>Hello from my node.js server!</h1></body>');
    res.write('</html>');
    res.end(); // this is to end the response
});

server.listen(3000); // this is a port number
