const sql = require('mssql');
require('dotenv').config();

const sqlConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    server: 'localhost',
    pool: {
      max: 10,
      min: 0,
      idleTimeoutMillis: 30000
    },
    options: {
      encrypt: false, // for azure
      trustServerCertificate: true // change to true for local dev / self-signed certs
    }
};

const sqlPool = new sql.ConnectionPool(sqlConfig);
let _db = null;

const connectDB = (callback) => {
    sqlPool.connect()
    .then((pool) => {
        _db = pool;
        callback();
    })
    .catch(err => {
        console.log('Connection Failed');
        throw err;
    });
};

const getDB = () => {
    if(_db)
        return _db;
    throw new Error('No database found');
};

module.exports = {
    connectDB,
    getDB,
};  
