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
    const likes = game.likes || 0;
    const dislikes = game.dislikes || 0;
    const locked = !!game.locked;

    await db.query(
      `INSERT INTO ${table} (id, name, cover, url, likes, dislikes, locked)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (id) DO UPDATE SET
         name = $2, cover = $3, url = $4,
         likes = $5, dislikes = $6, locked = $7`,
      [id, name, cover, url, likes, dislikes, locked]
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

router.post('/favorites/:id/state', async (req, res) => {
  const { id } = req.params;
  const { likes, dislikes, locked } = req.body;
  try {
    await db.query(
      `UPDATE favorites SET likes = $1, dislikes = $2, locked = $3 WHERE id = $4`,
      [likes, dislikes, locked, id]
    );
    res.json({ message: 'State updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;


// Aggiorna like
router.post('/:id/like', async (req, res) => {
  const gameId = req.params.id;
  try {
    await db.query('UPDATE games SET likes = COALESCE(likes, 0) + 1 WHERE id = $1', [gameId]);
    res.sendStatus(200);
  } catch (err) {
    console.error('Errore durante l'aggiornamento dei like:', err);
    res.sendStatus(500);
  }
});

// Aggiorna dislike
router.post('/:id/dislike', async (req, res) => {
  const gameId = req.params.id;
  try {
    await db.query('UPDATE games SET dislikes = COALESCE(dislikes, 0) + 1 WHERE id = $1', [gameId]);
    res.sendStatus(200);
  } catch (err) {
    console.error('Errore durante l'aggiornamento dei dislike:', err);
    res.sendStatus(500);
  }
});

// Blocca il gioco
router.post('/:id/lock', async (req, res) => {
  const gameId = req.params.id;
  try {
    await db.query('UPDATE games SET locked = TRUE WHERE id = $1', [gameId]);
    res.sendStatus(200);
  } catch (err) {
    console.error('Errore durante l'aggiornamento dello stato locked:', err);
    res.sendStatus(500);
  }
});
