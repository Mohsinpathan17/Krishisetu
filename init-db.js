const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

async function initDB() {
  try {
    // Connect without specifying database name first
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      port: process.env.DB_PORT || 3306,
    });

    console.log('Connected to MySQL server');

    // Create database if it doesn't exist
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || 'krishisetu'}\`;`);
    console.log(`Database ${(process.env.DB_NAME || 'krishisetu')} created or already exists`);

    // Use the database
    await connection.query(`USE \`${process.env.DB_NAME || 'krishisetu'}\`;`);

    // Close the connection
    await connection.end();
    console.log('Database initialization completed');
  } catch (error) {
    console.error('Database initialization error:', error);
  }
}

initDB();