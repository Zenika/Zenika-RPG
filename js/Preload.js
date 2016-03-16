var ZenikaRPG = ZenikaRPG || {};

//loading the game assets
ZenikaRPG.Preload = function(){};

ZenikaRPG.Preload.prototype = {
  preload: function() {
  	//show loading screen

  	//load game assets
    this.load.tilemap('map', 'assets/map4.json', null, Phaser.Tilemap.TILED_JSON);
    this.load.image('tileset', 'assets/map4.png');
    this.load.image('wall', 'assets/wall16.png');

    this.load.spritesheet('ship', 'assets/humstar.png', 32, 32);
    this.load.image('ball', 'assets/shinyball.png');
    this.load.image('block', 'assets/block.png');

    this.load.spritesheet('button', 'assets/button_sprite_sheet.png', 193, 71);
  },
  create: function() {
    // this.state.start('MainMenu');
  	this.state.start('Game');
  }
};
