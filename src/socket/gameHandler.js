'use strict';

// Create a store for storing rooms and game info
const SocketData = require('./objects/SocketData');
const socketData = new SocketData();

module.exports = (io, socket) => {
  const hostGame = (roomName, playerName, playerId) => {
    socketData.createRoom(roomName, playerName, playerId);

    // Joining the room and saving player info
    socket.join(roomName);
    socket.data = {
      roomName: roomName,
      playerName: playerName,
    };

    // * Sending the join message to all other players.
    io.to(playerId).emit(
      'chat-message',
      `Welcome to the group ${playerName} !`,
      'chat',
    );
  };

  const joinGame = (roomName, playerName, playerId) => {
    if (!socketData.isRoomPresent(roomName)) {
      socket.emit('roomNotExists');
      return;
    }

    if (socketData.isPlayerPresentInRoom(playerName, roomName)) {
      socket.emit('playerAlreadyJoined');
      return;
    }

    if (socketData.isGameInProgress(roomName)) {
      socket.emit('gameInProgress');
      return;
    }

    // Adding player to the room
    socketData.addPlayerInRoom(playerName, playerId, roomName);

    // Room Exists and Joining the room and saving player info
    socket.emit('roomExists');
    socket.join(roomName);
    socket.data = {
      roomName: roomName,
      playerName: playerName,
    };

    // TODO: No need for so much things below
    // Broadcasting the message to other players in room that a player has joined.
    socket.broadcast
      .in(roomName)
      .emit('chat-message', `${playerName} joined `, 'chat');

    // Sending Welcome Message to the player
    io.to(playerId).emit(
      'chat-message',
      `Welcome to the group ${playerName} !`,
      'chat',
    );

    // Sending the players name of the host.
    io.to(playerId).emit(
      'chat-message',
      `Host : ${socketData.getRoomHostName(roomName)}`,
      'chat',
    );

    const players = socketData.getPlayersData(roomName);

    // Sending the players name of all members in the room.
    io.to(playerId).emit(
      'chat-message',
      `Members in the room : ${Object.keys(players)} !`,
      'chat',
    );

    // Updating the room length.
    io.in(roomName).emit('set-room-data', players);
  };

  const sendChatMessage = (message, playerName, roomName) => {
    io.in(roomName).emit('chat-message', message, playerName);
  };

  const kickPlayer = (sender, kickPlayer, roomName) => {
    if (!socketData.isHost(sender, roomName)) return;
    if (!socketData.isPlayerPresentInRoom(kickPlayer, roomName)) return;

    const kickPlayerId = socketData.getPlayerId(kickPlayer, roomName);
    io.to(kickPlayerId).emit('onKick');
  };

  const gameStarted = (playerName, roomName, sentenceText) => {
    if (!socketData.isHost(playerName, roomName)) {
      console.error('Error: Only Host of the Room can start the Game');
      return;
    }

    // startGame sets up the room
    socketData.startGame(roomName);
    io.in(roomName).emit('gameStartedCondition', sentenceText);
  };

  const gameEnded = (playerName, roomName, playerData) => {
    if (!socketData.isPlayerPresentInRoom(playerName, roomName)) return;

    // Update the player data
    socketData.finishPlayerGameAndUpdate(playerName, roomName, playerData);

    // Refresh the graph and send player finished message
    io.in(roomName).emit('refreshGraph', socketData.getPlayersData(roomName));
    socket.broadcast
      .in(roomName)
      .emit('chat-message', `${playerName} finished ! `, 'chat');

    // Check if all players in the Room are finished playing
    if (
      socketData.isAllPlayersFinishedGame(roomName) ||
      !socketData.isGameInProgress(roomName)
    ) {
      socketData.endGame(roomName);
      const hostId = socketData.getRoomHostId(roomName);
      io.to(hostId).emit('showStartButton');
    }
  };

  const playerDisconnected = () => {
    const { playerName, roomName } = socket.data;
    if (!socketData.isPlayerPresentInRoom(playerName, roomName)) return;

    // Delete the player from the room
    socketData.removePlayer(playerName, roomName);

    // If room empty delete the room and exit
    if (socketData.isRoomEmpty(roomName)) {
      socketData.deleteRoom(roomName);
      return;
    }

    const hostName = socketData.getRoomHostName(roomName);
    io.in(socket.roomName).emit(
      'chat-message',
      hostName == playerName
        ? `${socket.playerName} left the Room and ${newHost} is the new Host.`
        : `${playerName} left the Room `,
      'chat',
    );

    // Update the data at client side
    io.in(roomName).emit('set-room-data', socketData.getPlayersData(roomName));

    // Give the start button to the host if game is finished or not yet started
    const allPlayersFinished = socketData.isAllPlayersFinishedGame(roomName);
    const gameInProgress = socketData.isGameInProgress(roomName);

    if (allPlayersFinished || !gameInProgress) {
      const hostId = socketData.getRoomHostId(roomName);
      io.to(hostId).emit('showStartButton');
    }
  };

  // Registering Handlers
  socket.on('hostingAGame', hostGame);
  socket.on('joiningAGame', joinGame);
  socket.on('send-chat-message', sendChatMessage);
  socket.on('kickPlayer', kickPlayer);
  socket.on('gameStarted', gameStarted);
  socket.on('playerFinished', gameEnded);
  socket.on('disconnect', playerDisconnected);
};
