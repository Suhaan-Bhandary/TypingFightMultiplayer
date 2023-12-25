'use strict';

const Player = require('./Player');

class Room {
  constructor(name, hostName, hostId) {
    this.host = hostName;
    this.roomName = name;
    this.gameStarted = false;
    this.players = {
      [hostName]: new Player(hostName, hostId),
    };
  }
}

module.exports = Room;
