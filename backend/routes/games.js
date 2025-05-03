const express = require('express');
const router = express.Router();
const db = require('../db');

function normalizeCover(cover) {
  if (typeof cover === 'object' && cover.image_id) {
    return `https://images.igdb.com/igdb/image/upload/t_cover_big/${cover.image_id}.jpg`;
  }
  return typeof cover === 'string' ? cover : '';
}

function insertGames(table, games) {
  const stmt = db.prepare(`INSERT OR REPLACE INTO ${table} (id, name, cover, url) VALUES (?, ?, ?, ?)`);
  for (const game of games) {
    const id = game.id;
    const name = game.name || '';
    const cover = normalizeCover(game.cover);
    const url = game.url || '';
    stmt.run(id, name, cover, url);
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
