const mysql = require('mysql2/promise');
const crypto = require('crypto');

function hashPassword(password) {
  const iterations = 120000;
  const keyLength = 64;
  const digest = 'sha512';
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, iterations, keyLength, digest).toString('hex');
  return `pbkdf2$${iterations}$${salt}$${hash}`;
}

async function setupAdmin() {
  const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'dijahaechan',
    database: 'rs_yasmin'
  });

  try {
    // Check if users table exists
    const [tables] = await pool.query("SHOW TABLES LIKE 'users'");
    if (tables.length === 0) {
      console.log("Creating users table...");
      await pool.query(`
        CREATE TABLE users (
          id INT PRIMARY KEY AUTO_INCREMENT,
          username VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          role VARCHAR(50) DEFAULT 'admin',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log("Users table created!");
    }

    // Delete existing admin user (if any)
    await pool.query("DELETE FROM users WHERE username = 'admin'");

    // Insert new admin user
    await pool.query("INSERT INTO users (username, password, role) VALUES (?, ?, ?)", [
      'admin',
      hashPassword('admin123'),
      'admin'
    ]);

    console.log("✓ Admin user created/updated!");
    console.log("Username: admin");
    console.log("Password: admin123");
  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    process.exit(0);
  }
}

setupAdmin();
