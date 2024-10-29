const express = require('express');
const http = require('http');

const gameRoutes = require('./routes/gameRoutes');
const db = require('./db');

const app = express();
const server = http.createServer(app);


app.use(express.json());


app.use('/api/games', gameRoutes);


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
