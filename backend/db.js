const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function initialize() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS favorites (
      id TEXT PRIMARY KEY,
      name TEXT,
      cover TEXT,
      url TEXT,
      likes INTEGER DEFAULT 0,
      dislikes INTEGER DEFAULT 0,
      locked BOOLEAN DEFAULT false
    );
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS deleted (
      id TEXT PRIMARY KEY,
      name TEXT,
      cover TEXT,
      url TEXT
    );
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS collection (
      id TEXT PRIMARY KEY,
      name TEXT,
      cover TEXT,
      url TEXT
    );
  `);
}

module.exports = {
  query: (text, params) => pool.query(text, params),
  initialize
};
