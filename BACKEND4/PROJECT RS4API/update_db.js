const mysql = require('mysql2/promise');

async function updateDb() {
  const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'dijahaechan',
    database: 'rs_yasmin'
  });

  try {
    // Add columns if they don't exist
    const [columns] = await pool.query("SHOW COLUMNS FROM poli");
    const columnNames = columns.map(c => c.Field);
    
    if (!columnNames.includes('harga_beli')) {
      await pool.query("ALTER TABLE poli ADD COLUMN harga_beli INT DEFAULT 0");
      console.log("Added harga_beli");
    }
    if (!columnNames.includes('harga_jual')) {
      await pool.query("ALTER TABLE poli ADD COLUMN harga_jual INT DEFAULT 0");
      console.log("Added harga_jual");
    }
    console.log("DB Updated!");
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}
updateDb();
