const mysql = require('mysql2/promise'); // Using the Promise version for Async/Await
require('dotenv').config();

// Create a connection pool
// Pools are better than single connections because they can handle 
// multiple concurrent requests (essential for scaling).
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Helper function to test connection
async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('✅ MySQL Database Connected Successfully');
        connection.release(); // Always release connection back to pool!
    } catch (error) {
        console.error('❌ Database Connection Failed:', error.message);
        // Optional: Create DB if it doesn't exist (Advanced)
    }
}

testConnection();

module.exports = pool;