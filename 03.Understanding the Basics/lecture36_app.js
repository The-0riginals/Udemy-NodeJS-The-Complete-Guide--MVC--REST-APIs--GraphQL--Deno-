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
            <input type="text" name="message">
                <button type="submit">Send</button>
        </form>
        </body>`
        );
        res.write('</html>');
        return res.end(); // this is to end the response
    }
    if (url === '/message' && method === 'POST') {
        const body = [];
        req.on('data', (chunkOfData) => { // "on" helps you to listen to certain events 
            console.log(chunkOfData);
            body.push(chunkOfData);
        });
        return req.on('end', () => {  //return is to exit the function execution
            const parsedBody = Buffer.concat(body).toString(); // this is to convert the body to a string
            // buffer is like a bus stop, it's a global object helps you to collect chunks of data

            console.log(parsedBody);
            const message = parsedBody.split('=')[1]; // this is to get the message from the body
            // we don't want to block the code execution, so we should use writeFile instead of writeFileSync
            fs.writeFile('lecture36_message.txt', message, err => {
                res.statusCode = 302;
                res.setHeader('Location', '/');
                return res.end();
            });
        });
    }

    // because we return the response in the if statement above, this code below will not be executed
    res.setHeader('Content-Type', 'text/html'); // this is to set the header of the response that all content is html
    res.write('<html>');
    res.write('<head><title>My First Page</title></head>');
    res.write('<body><h1>Hello from my node.js server!</h1></body>');
    res.write('</html>');
    res.end(); // this is to end the response
});

server.listen(3000); // this is a port number
