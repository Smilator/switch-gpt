const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.resolve(__dirname, 'data', 'games.db');

const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS favorites (
    id TEXT PRIMARY KEY,
    name TEXT,
    cover TEXT,
    url TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS deleted (
    id TEXT PRIMARY KEY,
    name TEXT,
    cover TEXT,
    url TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS collection (
    id TEXT PRIMARY KEY,
    name TEXT,
    cover TEXT,
    url TEXT
  )`);
});

module.exports = db;
