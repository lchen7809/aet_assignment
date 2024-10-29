import React, { useEffect } from 'react';
import io from 'socket.io-client';

function App() {
  useEffect(() => {
 
    const socket = io('http://localhost:3000', {
      transports: ['websocket'], 
      reconnection: true, 
      reconnectionAttempts: 10, 
      reconnectionDelay: 2000, 
    });


    socket.on('connect', () => {
      console.log(`Connected to server: ${socket.id}`);
      socket.emit('message', 'Hello from client!');
    });

    socket.on('response', (data) => {
      console.log('Received from server:', data);
    });

    socket.on('disconnect', (reason) => {
      console.log(`Disconnected from server, reason: ${reason}`);
    });

    socket.on('connect_error', (err) => {
      console.error('Connection error:', err.message);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="App">
      <h1>Simple Socket.IO Test</h1>
    </div>
  );
}

export default App;
