const express = require('express');
const router = express.Router();
const { createGame, getGameBySessionId } = require('../models/game');

//route / create a new game session
router.post('/', (req, res) => {
  const sessionId = `Game_${Date.now()}`; //creates uique sessionId based on timestamp
  createGame(sessionId, (err, game) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json(game);
  });
});

//route /:sessionId to retrieve a game by sessionId
router.get('/:sessionId', (req, res) => {
  const sessionId = req.params.sessionId;
  getGameBySessionId(sessionId, (err, game) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }
    res.json(game);
  });
});

module.exports = router;
