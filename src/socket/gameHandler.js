'use strict';

const Room = require('./objects/Room');
const Player = require('./objects/Player');

// Configuration for the Game
let rooms = {};

module.exports = (io, socket) => {
  const playerDisconnected = () => {
    // checking if player is in a room :
    let currentPlayerName = socket.playerName;
    let currentPlayerRoomName = socket.roomName;

    if (currentPlayerName && rooms[currentPlayerRoomName]) {
      let currentPlayerRoom = rooms[currentPlayerRoomName];

      // Deleting the player from the room.
      delete currentPlayerRoom.players[currentPlayerName];

      // Checking how many players are remaining to finish.
      let playersNotFinished = Object.keys(currentPlayerRoom.players).filter(
        (playerElement) =>
          !currentPlayerRoom.players[playerElement].playerFinished,
      );

      // New length :
      let keys = Object.keys(currentPlayerRoom.players);
      let roomLength = keys.length;

      console.table(currentPlayerRoom.players);

      if (currentPlayerRoom.host == currentPlayerName) {
        if (roomLength == 0) {
          delete rooms[currentPlayerRoomName];
          // console.table(rooms);
        } else {
          let newHost = keys[(roomLength * Math.random()) << 0];

          currentPlayerRoom.host = newHost;

          playersInfo = currentPlayerRoom.players;

          // Displaying the message that the player left the room.
          io.in(socket.roomName).emit(
            'chat-message',
            `${socket.playerName} left the Room and ${newHost} is the new Host.`,
            'chat',
          );

          // Updating the room length.
          io.in(socket.roomName).emit(
            'set-room-data',
            rooms[currentPlayerRoomName].players,
          );
        }
      } else {
        console.log('this is running');

        // console.table(currentPlayerRoom.players);

        // Updating the room length.
        // Displaying the message that the player left the room.
        io.in(currentPlayerRoomName).emit(
          'chat-message',
          `${currentPlayerName} left the Room `,
          'chat',
        );

        io.in(currentPlayerRoomName).emit(
          'set-room-data',
          rooms[currentPlayerRoomName].players,
        );
      }

      try {
        hostId =
          currentPlayerRoom.players[rooms[currentPlayerRoomName].host].playerId;
        if (playersNotFinished == 0 || !currentPlayerRoom.gameStarted)
          io.to(hostId).emit('showStartButton');
      } catch (e) {
        console.log('hostId is not defined.');
      }
    }
  };

  const hostGame = (roomName, playerName, playerId) => {
    socket.playerName = playerName;
    socket.roomName = roomName;

    var newRoom = new Room(roomName, playerName);
    var newPlayer = new Player(playerName, playerId);

    rooms[roomName] = newRoom;
    rooms[roomName].players[playerName] = newPlayer;

    // Joining the room.
    socket.join(roomName);

    // * Sending the join message to all other players.
    io.to(playerId).emit(
      'chat-message',
      `Welcome to the group ${playerName} !`,
      'chat',
    );
  };

  const joinGame = (roomName, playerName, playerId) => {
    //  * Write logic for the joining of the room.
    if (roomName in rooms) {
      if (playerName in rooms[roomName].players) {
        socket.emit('playerAlreadyJoined');
      } else {
        if (rooms[roomName].gameStarted) {
          socket.emit('gameInProgress');
        } else {
          socket.playerName = playerName;
          socket.roomName = roomName;

          var newPlayer = new Player(playerName, playerId);
          rooms[roomName].players[playerName] = newPlayer;

          // * Joining the room
          socket.join(roomName);

          // * Room exists.
          socket.emit('roomExists');

          // * Sending the join message to all other players.
          socket.broadcast
            .in(roomName)
            .emit('chat-message', `${playerName} joined `, 'chat');

          // * Sending the join message to all other players.
          io.to(playerId).emit(
            'chat-message',
            `Welcome to the group ${playerName} !`,
            'chat',
          );

          // * Sending the players name of the host.
          io.to(playerId).emit(
            'chat-message',
            `Host : ${rooms[roomName].host}`,
            'chat',
          );

          // * Sending the players name of all members in the room.
          io.to(playerId).emit(
            'chat-message',
            `Members in the room : ${Object.keys(rooms[roomName].players)} !`,
            'chat',
          );

          // * Updating the room length.
          io.in(roomName).emit('set-room-data', rooms[roomName].players);
        }
      }
    } else {
      socket.emit('roomNotExists');
    }
  };

  const sendChatMessage = (message, playerName, roomName) => {
    io.in(roomName).emit('chat-message', message, playerName);
  };

  const kickPlayer = (sender, kickPlayer, roomName) => {
    if (sender === rooms[roomName].host) {
      console.log('kicked');
      if (rooms[roomName].players[kickPlayer]) {
        io.to(rooms[roomName].players[kickPlayer].playerId).emit('onKick');
      }
    }
  };

  const gameStarted = (playerName, roomName, sentenceText) => {
    if (playerName == rooms[roomName].host) {
      rooms[roomName].gameStarted = true;

      for (const x in rooms[roomName].players) {
        rooms[roomName].players[x].playerFinished = false;
        rooms[roomName].players[x].playerData = {};
      }

      io.in(roomName).emit('gameStartedCondition', sentenceText);
    } else {
      console.error('A non host player tried to get in the system.');
    }
  };

  const gameEnded = (playerName, roomName, playerData) => {
    rooms[roomName].players[playerName].playerData = playerData;
    rooms[roomName].players[playerName].playerFinished = true;

    playersInfo = rooms[roomName].players;

    playersNotFinished = Object.keys(rooms[roomName].players).filter((key) => {
      return !rooms[roomName].players[key].playerFinished;
    });

    if (playersNotFinished.length == 0) {
      rooms[roomName].gameStarted = false;
      host = rooms[roomName].host;
      hostId = rooms[roomName].players[host].playerId;
      if (playersNotFinished == 0 || !currentPlayerRoom.gameStarted)
        io.to(hostId).emit('showStartButton');
    }

    io.in(roomName).emit('refreshGraph', rooms[roomName].players);

    // * Sending the join message to all other players.
    socket.broadcast
      .in(roomName)
      .emit('chat-message', `${playerName} finished ! `, 'chat');
  };

  // Registering Handlers
  socket.on('disconnect', playerDisconnected);
  socket.on('hostingAGame', hostGame);
  socket.on('joiningAGame', joinGame);
  socket.on('send-chat-message', sendChatMessage);
  socket.on('kickPlayer', kickPlayer);
  socket.on('gameStarted', gameStarted);
  socket.on('playerFinished', gameEnded);
};
