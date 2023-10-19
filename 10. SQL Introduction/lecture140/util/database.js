// get the client
const mysql = require('mysql2');

// create the connection to database
// const connection = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   database: 'test'
// });

// Create the connection pool. The pool-specific settings are the defaults
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'node-complete',
    password: '19001009',
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
    idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
  });

module.exports = pool.promise();// export the pool to be used in other files