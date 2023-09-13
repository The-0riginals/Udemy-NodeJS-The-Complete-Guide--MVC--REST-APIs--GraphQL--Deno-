const http = require('http');

const server = http.createServer((req, res) => {
    const url = req.url;
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
    res.setHeader('Content-Type', 'text/html'); // this is to set the header of the response that all content is html
    res.write('<html>');
    res.write('<head><title>My First Page</title></head>');
    res.write('<body><h1>Hello from my node.js server!</h1></body>');
    res.write('</html>');
    res.end(); // this is to end the response
});

server.listen(3000); // this is a port number
