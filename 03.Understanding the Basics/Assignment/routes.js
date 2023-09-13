const handleRequest = (req, res) => {
    const url = req.url;
    const method = req.method;
    if(url === '/'){
        res.write(`
        <html>
        <head><title>Enter Message</title></head>
        <body>
        <h1>Assignment 1: welcome to the first try</h1>
        <form action="/create-user" method="POST">
            <input type="text" name="username">
            <button type="submit">Send</button>
        </form>
        </body>
        </html>
        `);
        return res.end(); // this is to end the response
    }
    if(url === '/users'){
        res.write(`
        <html>
        <head><title>Users</title></head>
        <body>
        <ul>
            <li>User 1</li>
            <li>User 2</li>
            <li>User 3</li>
            <li>User 4</li>
        </ul>
        </body>
        </html>
        `);
        return res.end(); // this is to end the response
    }
    if(url === '/create-user' && method === 'POST'){
        const body = [];
        req.on('data', (chunkOfData) => {
            console.log(chunkOfData);
            body.push(chunkOfData);
        });
        return req.on('end', () => {
            const parsedBody = Buffer.concat(body).toString(); // this is to convert the body to a string
            console.log(parsedBody);
            const message = parsedBody.split('=')[1]; // this is to get the message from the body
            console.log(message);
            res.statusCode = 302;
            res.setHeader('Location', '/users'); // u can use /create-user or / , as well , play around to have fun =)))
            return res.end();
        });
    }
    res.end();
};

module.exports = handleRequest;
