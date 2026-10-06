const mariadb = require('mariadb');
require('dotenv').config();

async function testConnection() {
  console.log("Attempting to connect with:");
  console.log("HOST:", process.env.DATABASE_HOST || 'localhost');
  console.log("USER:", process.env.DATABASE_USER);
  console.log("PASS:", process.env.DATABASE_PASSWORD);
  console.log("DB:", process.env.DATABASE_NAME);
  
  try {
    const pool = mariadb.createPool({
      host: process.env.DATABASE_HOST || 'localhost',
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      connectionLimit: 5
    });

    const conn = await pool.getConnection();
    console.log("Connection successful!");
    const rows = await conn.query("SELECT 1 as val");
    console.log("Query test:", rows);
    conn.release();
    pool.end();
  } catch (err) {
    console.error("Connection failed with error:");
    console.error(err);
  }
}

testConnection();
