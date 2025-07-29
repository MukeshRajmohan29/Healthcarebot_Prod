const { Pool } = require('pg');
let pool;

async function initializeDatabase() {
  if (!pool) {
    pool = new Pool({
      host: process.env.PGHOST,
      database: process.env.PGDATABASE,
      user: process.env.PGUSER,
      password: process.env.PGPASSWORD,
      ssl: {
        rejectUnauthorized: false,
        sslmode: process.env.PGSSLMODE,
        channelBinding: process.env.PGCHANNELBINDING
      },
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });

    // Test the connection
    try {
      await pool.query('SELECT NOW()');
      // Create chat_logs table
      const createTableSQL = `
        CREATE TABLE IF NOT EXISTS chat_logs (
          id SERIAL PRIMARY KEY,
          session_id VARCHAR(255) NOT NULL,
          healthcare_context VARCHAR(100) NOT NULL,
          privacy_style VARCHAR(50) NOT NULL,
          user_first_name VARCHAR(100),
          user_last_name VARCHAR(100),
          user_age INTEGER,
          user_dob DATE,
          user_input TEXT NOT NULL,
          bot_reply TEXT NOT NULL,
          timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `;
      await pool.query(createTableSQL);
    } catch (err) {
      console.error('Error initializing database:', err.message);
      throw err;
    }
  }
  return pool;
}

function getDatabase() {
  if (!pool) {
    throw new Error('Database not initialized. Call initializeDatabase() first.');
  }
  return pool;
}

module.exports = { initializeDatabase, getDatabase };
