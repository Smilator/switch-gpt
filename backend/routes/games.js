const express = require('express');
const router = express.Router();
const db = require('../db');

function insertGames(table, games) {
  const stmt = db.prepare(`INSERT OR REPLACE INTO ${table} (id, name, cover, url) VALUES (?, ?, ?, ?)`);
  for (const game of games) {
    stmt.run(game.id, game.name, game.cover, game.url);
  }
  stmt.finalize();
}

router.post('/import', (req, res) => {
  const { favorites = [], deleted = [], collection = [] } = req.body;

  insertGames('favorites', favorites);
  insertGames('deleted', deleted);
  insertGames('collection', collection);

  res.json({ message: 'Import completed successfully' });
});

router.get('/favorites', (req, res) => {
  db.all('SELECT * FROM favorites ORDER BY name', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

router.get('/deleted', (req, res) => {
  db.all('SELECT * FROM deleted ORDER BY name', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

router.get('/collection', (req, res) => {
  db.all('SELECT * FROM collection ORDER BY name', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

module.exports = router;
