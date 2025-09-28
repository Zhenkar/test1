const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// MySQL connection configuration
const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  multipleStatements: true // allows multiple SQL statements in one query
});

// Path to your SQL file
const sqlFile = path.join(__dirname, 'schema.sql');

// Read SQL file
const sql = fs.readFileSync(sqlFile, 'utf8');

// Run SQL file
connection.query(sql, (err, results) => {
  if (err) {
    console.error('Error running SQL file:', err);
  } else {
    console.log('Database and tables created successfully!');
  }
  connection.end();
});
