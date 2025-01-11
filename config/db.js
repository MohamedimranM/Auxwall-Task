const sql = require('mssql');

const dbConfig = {
    server: 'DESKTOP-NVEG3MD\\SQLEXPRESS',
    database: 'discount',
    user: 'sa',
    password: '123456',
    options: {
        encrypt: true,
        trustServerCertificate: true,
    },
};

const pool = new sql.ConnectionPool(dbConfig);
pool.connect().then(() => console.log("Database connected.")).catch(err => console.error(err));

module.exports = pool;




