const sql = require('mssql');
const dotenv = require('dotenv')
dotenv.config()

const dbConfig = {
    server: process.env.SERVER,
    database: process.env.DATABASE,
    user: process.env.USER,
    password: process.env.PASSWORD,
    port: 19702,
   
    options: {
        encrypt: true,
        trustServerCertificate: true,
    },
};

const pool = new sql.ConnectionPool(dbConfig);
pool.connect().then(() => console.log("Database connected.")).catch(err => console.error(err));

module.exports = pool;




