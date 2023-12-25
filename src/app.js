const express = require('express');
const path = require('path');

const app = express();

const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Public Files
const PUBLIC_FILE_PATH = path.join(__dirname, 'public');
app.use(express.static(PUBLIC_FILE_PATH));

// Serving the Site
app.get('/', async (req, res) => {
  res.status(200).sendFile('index.html');
});

// Not found route
app.get('*', (req, res) => {
  return res.status(404).json({ message: 'URL is not valid' });
});

// Socket io setup
const registerGameHandlers = require('./socket/gameHandler');
const onConnection = (socket) => {
  registerGameHandlers(io, socket);
};

io.on('connection', onConnection);

// We have to return server in place of app
module.exports = server;
