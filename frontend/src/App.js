import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3000', {
  transports: ['websocket'],
});

function App() {
  const [gameId, setGameId] = useState(null);

  useEffect(() => {
    socket.on('connect', () => {
      console.log(`Connected to server: ${socket.id}`);
    });

    socket.on('gameCreated', (data) => {
      setGameId(data.gameId);
      console.log('Game created:', data.gameId);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleCreateGame = () => {
    socket.emit('createGame');
  };

  return (
    <div className="App">
      <h1>Simple Socket.IO Game</h1>
      <button onClick={handleCreateGame}>Create Game</button>
      {gameId && <p>Game ID: {gameId}</p>}
    </div>
  );
}

export default App;
