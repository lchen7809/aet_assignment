const sqlite3 = require('sqlite3').verbose();

//create new db
const db = new sqlite3.Database('./tic_tac_toe.db', (err) => {
  if (err) {
    console.error('Failed to connect:', err.message);
  } else {
    console.log('Connected to sqlite database.');
  }
});

//create the games table if it doesn't already exist
db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS games (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        session_id TEXT,
        board TEXT,
        player_turn TEXT,
        status TEXT,
        moves TEXT
      )
    `, (err) => {
      if (err) {
        console.error('Error creating games table:', err.message);
      } else {
        console.log('Games table created or already exists'); // Debug log
      }
    });
  });

module.exports = db;
