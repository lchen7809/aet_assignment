const db = require('../db');

//create new game in db
const createGame = (sessionId, callback) => {
  const initialBoard = JSON.stringify(Array(3).fill(Array(3).fill(null)));
  const playerTurn = 'player1';
  const status = 'ongoing';
  const moves = '[]'; //start with 0 moves

  const sql = `
    INSERT INTO games (session_id, board, player_turn, status, moves)
    VALUES (?, ?, ?, ?, ?)
  `;
  const params = [sessionId, initialBoard, playerTurn, status, moves];

  db.run(sql, params, function(err) {
    if (err) return callback(err);
    callback(null, { id: this.lastID, sessionId });
  });
};

//retrieve a game by sessionId
const getGameBySessionId = (sessionId, callback) => {
  const sql = `SELECT * FROM games WHERE session_id = ?`;
  db.get(sql, [sessionId], (err, game) => {
    if (err) return callback(err);
    callback(null, game);
  });
};

module.exports = {
  createGame,
  getGameBySessionId,
};
