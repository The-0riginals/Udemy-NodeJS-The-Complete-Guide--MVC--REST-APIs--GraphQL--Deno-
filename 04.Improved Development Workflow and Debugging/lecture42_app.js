const http = require('http');

const routes = require('./lecture42_routes');
console.log(routes.someText);
const server = http.createServer(routes.handler);

server.listen(3000);

// we didnt pass the req and res to the routes.js file because : 
//it is because we are not calling the routes function. That is, we don't want to execute it. We are just passing the name of it to node, and node will call it for us.
// When node calls the function, it will pass in req and res