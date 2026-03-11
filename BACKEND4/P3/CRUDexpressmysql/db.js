const mysql = require('mysql2');

const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'dijahaechan',
    database: 'crud_db' // sesuai nama database yang kita buat
});

conn.connect((err) => {
    if (err) throw err;
    console.log('Terhubung Ke MySQL!');
});

module.exports = conn;