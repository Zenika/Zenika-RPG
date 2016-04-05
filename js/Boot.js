var ZenikaRPG = ZenikaRPG || {};

ZenikaRPG.Boot = function(){};

ZenikaRPG.Boot.prototype = {
  preload: function() {
  },
  create: function() {
    this.game.stage.backgroundColor = '#2d2d2d';
  	this.game.physics.startSystem(Phaser.Physics.P2JS);
    this.state.start('Preload');
  }
};
