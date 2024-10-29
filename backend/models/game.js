const db = require('../db');

const createGame = (sessionId, callback) => {
  const initialBoard = JSON.stringify(Array(3).fill(Array(3).fill(null)));
  const playerTurn = 'player1';
  const status = 'ongoing';
  const moves = '[]'; 

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

const getGameBySessionId = (sessionId, callback) => {
  const sql = `SELECT * FROM games WHERE session_id = ?`;
  db.get(sql, [sessionId], (err, game) => {
    if (err) return callback(err);
    callback(null, game);
  });
};

const updateGameInDB = (sessionId, row, col, player) => {
  return new Promise((resolve, reject) => {
    db.get(`SELECT * FROM games WHERE session_id = ?`, [sessionId], (err, game) => {
      if (err) return reject(err);
      if (!game) return reject(new Error('Game not found'));

      let board = JSON.parse(game.board);
      let moves = JSON.parse(game.moves);

      board[row][col] = player;
      moves.push({ row, col, player });

      const winner = checkWinner(board);
      const status = winner ? 'finished' : (moves.length === 9 ? 'draw' : 'ongoing');

      const sql = `
        UPDATE games
        SET board = ?, moves = ?, player_turn = ?, status = ?, winner = ?
        WHERE session_id = ?
      `;
      const params = [
        JSON.stringify(board),
        JSON.stringify(moves),
        player === 'player1' ? 'player2' : 'player1',
        status,
        winner,
        sessionId,
      ];

      db.run(sql, params, function(err) {
        if (err) return reject(err);

        resolve({
          board,
          moves,
          playerTurn: params[2],
          status,
          winner,
        });
      });
    });
  });
};

function checkWinner(board) {
  //check rows, columns, and diagonals for a winner
  for (let i = 0; i < 3; i++) {
    if (board[i][0] && board[i][0] === board[i][1] && board[i][1] === board[i][2]) {
      return board[i][0];
    }
    if (board[0][i] && board[0][i] === board[1][i] && board[1][i] === board[2][i]) {
      return board[0][i];
    }
  }
  //check diagonals
  if (board[0][0] && board[0][0] === board[1][1] && board[1][1] === board[2][2]) {
    return board[0][0];
  }
  if (board[0][2] && board[0][2] === board[1][1] && board[1][1] === board[2][0]) {
    return board[0][2];
  }
  return null;
}

module.exports = {
  createGame,
  getGameBySessionId,
  updateGameInDB,
};
