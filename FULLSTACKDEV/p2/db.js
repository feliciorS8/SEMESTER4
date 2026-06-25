const mysql = require('mysql2');

const conn = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'dijahaechan',
  database: 'fullstackdev'
});

conn.connect((err) => {
  if (err) throw err;
  console.log('Terhubung Ke MySQL!');
});

module.exports = conn;
