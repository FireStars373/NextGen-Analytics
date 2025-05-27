const mysql = require("mysql2/promise");
require("dotenv").config();

// Create a connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || "yamabiko.proxy.rlwy.net",
  user: process.env.DB_USER || "railway",
  password: process.env.DB_PASSWORD || "t9dkR4WoA75.qj_n4TlP1GlRXHQ_G6Tg",
  database: process.env.DB_NAME || "railway",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test the connection
pool
  .getConnection()
  .then((connection) => {
    console.log("Database connected successfully");
    connection.release();
  })
  .catch((err) => {
    console.error("Error connecting to database:", err);
  });

module.exports = pool;
