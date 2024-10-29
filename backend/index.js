const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const gameRoutes = require('./routes/gameRoutes');
const db = require('./db');
const { updateGameInDB, getGameBySessionId } = require('./models/game'); //import game logic

const app = express();
const server = http.createServer(app); 
const io = socketIo(server); 

app.use(express.json());
app.use('/api/games', gameRoutes);

//handle incoming socket connections
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  //handle joining a game session
  socket.on('joinGame', (sessionId) => {
    socket.join(sessionId); // Join a specific game session room
    console.log(`User joined game session: ${sessionId}`);

    //send the current game state to the joining player
    getGameBySessionId(sessionId, (err, game) => {
      if (err) {
        console.error('Error retrieving game state:', err.message);
        return;
      }
      socket.emit('updateGame', game);
    });
  });

  //handle player moves
  socket.on('playerMove', async (data) => {
    const { sessionId, row, col, player } = data;
    console.log(`Player move: ${player} at [${row}, ${col}] in session ${sessionId}`);

    try {
      //update the game in the database
      const updatedGame = await updateGameInDB(sessionId, row, col, player);

      if (updatedGame) {
        //broadcast the updated game state to all players in the session
        io.to(sessionId).emit('updateGame', updatedGame);

        //check if the game has ended (win or draw)
        if (updatedGame.winner) {
          io.to(sessionId).emit('gameEnd', { winner: updatedGame.winner });
        } else if (updatedGame.status === 'draw') {
          io.to(sessionId).emit('gameEnd', { status: 'draw' });
        }
      }
    } catch (err) {
      console.error('Error updating game:', err.message);
    }
  });

  //handle disconnect
  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
