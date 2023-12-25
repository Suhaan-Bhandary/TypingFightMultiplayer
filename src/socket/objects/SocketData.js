'use strict';

const Room = require('./Room');
const Player = require('./Player');

class SocketData {
  constructor() {
    this.rooms = {};
  }

  // Creates and room and assigns a host to
  createRoom(roomName, hostName, hostId) {
    this.rooms[roomName] = new Room(roomName, hostName, hostId);
  }

  addPlayerInRoom(playerName, playerId, roomName) {
    if (!this.isRoomPresent(roomName)) return;
    this.rooms[roomName].players[playerName] = new Player(playerName, playerId);
  }

  removePlayer(playerName, roomName) {
    if (!this.isRoomPresent(roomName)) return;
    delete this.rooms[roomName].players[playerName];

    // If room is not empty then make other player host
    if (
      !this.isRoomEmpty(roomName) &&
      this.getRoomHostName(roomName) === playerName
    ) {
      const playerNames = Object.keys(this.rooms[roomName].players);
      const newHost = playerNames[(playerNames.length * Math.random()) << 0];

      this.rooms[roomName].host = newHost;
    }
  }

  startGame(roomName) {
    this.rooms[roomName].gameStarted = true;

    for (const player in this.rooms[roomName].players) {
      this.rooms[roomName].players[player].playerFinished = false;
      this.rooms[roomName].players[player].playerData = {};
    }
  }

  endGame(roomName) {
    this.rooms[roomName].gameStarted = false;
  }

  finishPlayerGameAndUpdate(playerName, roomName, playerData) {
    this.rooms[roomName].players[playerName].playerFinished = true;
    this.rooms[roomName].players[playerName].playerData = playerData;
  }

  getRoomHostId(roomName) {
    const host = this.rooms[roomName].host;
    const hostId = this.rooms[roomName].players[host].playerId;
    return hostId;
  }

  getRoomHostName(roomName) {
    return this.rooms[roomName].host;
  }

  getPlayerId(playerName, roomName) {
    const playerId = this.rooms[roomName].players[playerName].playerId;
    return playerId;
  }

  getPlayersData(roomName) {
    return this.rooms[roomName].players;
  }

  isRoomPresent(roomName) {
    return roomName in this.rooms;
  }

  isPlayerPresentInRoom(playerName, roomName) {
    if (!this.isRoomPresent(roomName)) return false;
    return playerName in this.rooms[roomName].players;
  }

  isHost(playerName, roomName) {
    if (!this.isRoomPresent(roomName)) return false;
    return playerName === this.rooms[roomName].host;
  }

  isGameInProgress(roomName) {
    return this.rooms[roomName].gameStarted;
  }

  isAllPlayersFinishedGame(roomName) {
    const players = this.rooms[roomName].players;
    return Object.keys(players).every((key) => players[key].playerFinished);
  }

  isRoomEmpty(roomName) {
    return Object.keys(this.rooms[roomName].players).length === 0;
  }

  deleteRoom(roomName) {
    delete this.rooms[roomName];
  }
}

module.exports = SocketData;
