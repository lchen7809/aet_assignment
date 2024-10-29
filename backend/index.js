const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:3001',
    methods: ['GET', 'POST'],
  },
});

//in-memory store for games
let games = {};

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('createGame', () => {
    const gameId = `game_${Date.now()}`;
    games[gameId] = {
      players: [socket.id],
      board: Array(3).fill().map(() => Array(3).fill(null)), //empty 3x3 board
      turn: 'X',
    };
    socket.join(gameId); //join the room
    socket.emit('gameCreated', { gameId });
    console.log(`Game created: ${gameId}`);
  });

  socket.on('disconnect', (reason) => {
    console.log(`User disconnected: ${socket.id}, reason: ${reason}`);
  });
});

const PORT = 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
