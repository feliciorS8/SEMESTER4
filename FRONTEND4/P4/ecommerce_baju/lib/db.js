// lib/db.js
import mysql from 'mysql2/promise';

export async function query(sql, values) {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'dijahaechan',
    database: 'ecommerce_baju'
  });

  const [results] = await connection.execute(sql, values);
  return results;
}
