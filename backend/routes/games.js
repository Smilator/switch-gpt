
const express = require('express');
const router = express.Router();
const db = require('../db');

// GET favorites con JOIN
router.get('/favorites', async (req, res) => {
    try {
        const result = await db.query(`
            SELECT g.id, g.name, g.likes, g.dislikes, g.locked
            FROM games g
            JOIN favorites f ON g.id = f.game_id
        `);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching favorites');
    }
});

// Increment like
router.post('/:id/like', async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('UPDATE games SET likes = likes + 1 WHERE id = $1', [id]);
        res.sendStatus(200);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error incrementing like');
    }
});

// Increment dislike
router.post('/:id/dislike', async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('UPDATE games SET dislikes = dislikes + 1 WHERE id = $1', [id]);
        res.sendStatus(200);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error incrementing dislike');
    }
});

// Toggle lock
router.post('/:id/lock', async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('UPDATE games SET locked = NOT locked WHERE id = $1', [id]);
        res.sendStatus(200);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error toggling lock');
    }
});

module.exports = router;
