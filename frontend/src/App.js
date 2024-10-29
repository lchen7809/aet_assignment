import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3000', {
  transports: ['websocket'],
});

function App() {
  const [gameId, setGameId] = useState('');
  const [joinedGame, setJoinedGame] = useState(null);

  useEffect(() => {
    socket.on('gameCreated', (data) => {
      setGameId(data.gameId);
      console.log('Game created:', data.gameId);
    });

    socket.on('playerJoined', (data) => {
      setJoinedGame(data.gameId);
      console.log('Joined game:', data);
    });

    socket.on('joinError', (data) => {
      alert(data.message);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleCreateGame = () => {
    socket.emit('createGame');
  };

  const handleJoinGame = () => {
    socket.emit('joinGame', gameId);
  };

  return (
    <div className="App">
      <h1>Simple Socket.IO Game</h1>
      <button onClick={handleCreateGame}>Create Game</button>
      <input
        type="text"
        value={gameId}
        onChange={(e) => setGameId(e.target.value)}
        placeholder="Enter Game ID"
      />
      <button onClick={handleJoinGame}>Join Game</button>
      {joinedGame && <p>Joined Game: {joinedGame}</p>}
    </div>
  );
}

export default App;
