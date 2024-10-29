import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './App.css';


const socket = io('http://localhost:3000');

function App() {
  const [board, setBoard] = useState(Array(3).fill().map(() => Array(3).fill(null)));
  const [player, setPlayer] = useState('player1'); 
  const [sessionId, setSessionId] = useState('Test_Session'); 
  const [message, setMessage] = useState('');

  useEffect(() => {
    socket.emit('joinGame', sessionId);

    socket.on('updateGame', (updatedGame) => {
      setBoard(JSON.parse(updatedGame.board)); 
    });


    socket.on('gameEnd', (result) => {
      if (result.winner) {
        setMessage(`Game Over! Winner: ${result.winner}`);
      } else if (result.status === 'draw') {
        setMessage("Game Over! It's a draw.");
      }
    });

    return () => {
      socket.disconnect(); 
    };
  }, [sessionId]);

  const handleCellClick = (row, col) => {
    if (board[row][col] === null) {
      const newBoard = board.map(row => [...row]);
      newBoard[row][col] = player === 'player1' ? 'X' : 'O';

      setBoard(newBoard);

      socket.emit('playerMove', { sessionId, row, col, player });
    }
  };

  return (
    <div className="App">
      <h1>Real-Time Tic-Tac-Toe</h1>
      <div className="game-board">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="row">
            {row.map((cell, colIndex) => (
              <button
                key={colIndex}
                className="cell"
                onClick={() => handleCellClick(rowIndex, colIndex)}
                aria-label={`Cell at row ${rowIndex + 1}, column ${colIndex + 1}`}
              >
                {cell || '-'}
              </button>
            ))}
          </div>
        ))}
      </div>
      <p>{message}</p>
    </div>
  );
}

export default App;
