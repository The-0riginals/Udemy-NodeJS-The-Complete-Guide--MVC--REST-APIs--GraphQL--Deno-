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
        //this is to listen to the data event
        req.on('data', (chunkOfData) => { // "on" helps you to listen to certain events 
            // this listener receives a "chunk of data" and this chunk of data is a buffer
            console.log(chunkOfData);
            body.push(chunkOfData);
        });
        //this is to listen to the end event
        req.on('end', () => { // this is to listen to the end of the data stream
            const parsedBody = Buffer.concat(body).toString(); // this is to convert the body to a string
            // buffer is like a bus stop, it's a global object helps you to collect chunks of data

            console.log(parsedBody);
            const message = parsedBody.split('=')[1]; // this is to get the message from the body
            fs.writeFileSync('lecture35_message.txt', message);

            //we should should move the block code to the end event listener if we do something influence with the response
            res.statusCode = 302; // this is to set the status code
            res.setHeader('Location', '/'); // this is to set the header back to /
            //It's what tells the browser to perform a re-direct. Once the response is sent, 
            //the browser will read the response and see a 302 status code, it then knows it has to initiate another request to the re-direction URL specified
            res.end();
        });
        //return; // this is to return the response and not to execute the following code (Hello from my node.js server!)
    }

    res.setHeader('Content-Type', 'text/html'); // this is to set the header of the response that all content is html
    res.write('<html>');
    res.write('<head><title>My First Page</title></head>');
    res.write('<body><h1>Hello from my node.js server!</h1></body>');
    res.write('</html>');
    res.end(); // this is to end the response
});

server.listen(3000); // this is a port number
