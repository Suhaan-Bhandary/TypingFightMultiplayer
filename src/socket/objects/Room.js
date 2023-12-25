'use strict';

class Room {
  constructor(name, hostName) {
    this.host = hostName;
    this.roomName = name;
    this.gameStarted = false;
    this.players = {};
  }
}

module.exports = Room;
