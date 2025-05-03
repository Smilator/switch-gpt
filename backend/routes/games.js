const express = require('express');
const router = express.Router();
const db = require('../db');

function normalizeCover(cover) {
  if (typeof cover === 'object' && cover.image_id) {
    return `https://images.igdb.com/igdb/image/upload/t_cover_big/${cover.image_id}.jpg`;
  }
  return typeof cover === 'string' ? cover : '';
}

async function insertGames(table, games) {
  for (const game of games) {
    const id = game.id;
    const name = game.name || '';
    const cover = normalizeCover(game.cover);
    const url = game.url || (game.slug ? `https://www.igdb.com/games/${game.slug}` : '');
    await db.query(
      `INSERT INTO ${table} (id, name, cover, url)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (id) DO UPDATE SET name = $2, cover = $3, url = $4`,
      [id, name, cover, url]
    );
  }
}

router.post('/import', async (req, res) => {
  const { favorites = [], deleted = [], collection = [] } = req.body;
  await insertGames('favorites', favorites);
  await insertGames('deleted', deleted);
  await insertGames('collection', collection);
  res.json({ message: 'Import completed successfully' });
});

router.get('/:type(favorites|deleted|collection)', async (req, res) => {
  try {
    const { rows } = await db.query(`SELECT * FROM ${req.params.type} ORDER BY name`);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
