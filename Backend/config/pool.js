const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'test',
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 20000
});


module.exports = pool;

// WOrking
// require('dotenv').config();
// const mysql = require('mysql2/promise');

// const pool = mysql.createPool({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
//     port: Number(process.env.DB_PORT),
//     waitForConnections: true,
//     connectionLimit: 10,
//     queueLimit: 0,
//     connectTimeout: 10000
// });

// module.exports = pool;


