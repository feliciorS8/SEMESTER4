import mysql from 'mysql2/promise';

// Konfigurasi koneksi database - sama dengan backend
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'dijahaechan',
    database: 'rs_yasmin'
};

// Connection pool untuk performa
const pool = mysql.createPool(dbConfig);

export default pool;
