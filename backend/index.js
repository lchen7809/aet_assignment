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

//In-memory store for games
let games = {};

io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);
  
    //handle creating a new game
    socket.on('createGame', () => {
      const gameId = `game_${Date.now()}`;
      games[gameId] = {
        players: [socket.id], //add the first player
        board: Array(3).fill().map(() => Array(3).fill(null)),
        turn: 'X',
      };
      socket.join(gameId); 
      socket.emit('gameCreated', { gameId });
      console.log(`Game created: ${gameId}, players: ${games[gameId].players}`);
    });
  
    //handle joining an existing game
    socket.on('joinGame', (gameId) => {
      console.log(`Received join request for game: ${gameId}`);
  
      //check if the game exists
      if (games[gameId]) {
        const game = games[gameId];
  
        //log current players in the game
        console.log(`Attempting to join game: ${gameId}, current players: ${game.players.length}`);
        
        //check no duplicate players
        if (!game.players.includes(socket.id)) {
          //check if there is room for a second player
          if (game.players.length < 2) {
            game.players.push(socket.id);
            socket.join(gameId); 
            io.to(gameId).emit('playerJoined', { gameId, players: game.players });
            console.log(`User ${socket.id} joined game: ${gameId}, players now: ${game.players}`);
          } else {
            socket.emit('joinError', { message: 'Game is already full.' });
            console.log(`Game is full: ${gameId}, players: ${game.players}`);
          }
        } else {
          console.log(`User ${socket.id} already in game: ${gameId}`);
        }
      } else {
        socket.emit('joinError', { message: 'Game not found.' });
        console.log(`Game not found: ${gameId}`);
      }
    });
  
    socket.on('disconnect', (reason) => {
      console.log(`User disconnected: ${socket.id}, reason: ${reason}`);
    });
  });
  

const PORT = 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
