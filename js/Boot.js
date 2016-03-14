var ZenikaRPG = ZenikaRPG || {};

ZenikaRPG.Boot = function(){};

//setting game configuration and loading the assets for the loading screen
ZenikaRPG.Boot.prototype = {
  preload: function() {
  	//assets we'll use in the loading screen
  },
  create: function() {
  	//loading screen will have a white background
    this.game.stage.backgroundColor = '#2d2d2d';

    //scaling options

  	//have the game centered horizontally

  	//screen size will be set automatically
  	// DEPRECATED this.scale.setScreenSize(true);

  	//physics system for movement
  	this.game.physics.startSystem(Phaser.Physics.P2JS);

    this.state.start('Preload');
  }
};
