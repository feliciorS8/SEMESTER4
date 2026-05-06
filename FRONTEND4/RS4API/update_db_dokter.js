const mysql = require('mysql2/promise');

async function updateDb() {
  const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'dijahaechan',
    database: 'rs_yasmin'
  });

  try {
    const [columns] = await pool.query("SHOW COLUMNS FROM dokter");
    const columnNames = columns.map(c => c.Field);
    
    if (!columnNames.includes('harga_beli')) {
      await pool.query("ALTER TABLE dokter ADD COLUMN harga_beli INT DEFAULT 0");
      console.log("Added harga_beli to dokter");
    }
    if (!columnNames.includes('harga_jual')) {
      await pool.query("ALTER TABLE dokter ADD COLUMN harga_jual INT DEFAULT 0");
      console.log("Added harga_jual to dokter");
    }
    console.log("DB Updated!");
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}
updateDb();
