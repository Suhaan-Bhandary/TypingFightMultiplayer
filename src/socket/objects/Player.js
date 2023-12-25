'use strict';

class Player {
  constructor(name, playerId) {
    this.playerName = name;
    this.playerId = playerId;
    this.playerData = {};
    this.playerFinished = false;
  }
}

module.exports = Player;
