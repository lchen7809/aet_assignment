import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Ensure there's a valid container element with ID 'root'
const container = document.getElementById('root');
if (container) {
  const root = ReactDOM.createRoot(container);
  root.render(<App />);
} else {
  console.error("No container found with ID 'root'");
}
