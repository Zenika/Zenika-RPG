var ZenikaRPG = ZenikaRPG || {};

ZenikaRPG.Preload = function(){};

ZenikaRPG.Preload.prototype = {
  preload: function() {
    this.load.image('map', 'assets/map5.png');

    this.load.spritesheet('ship', 'assets/player.png', 32, 32);
    this.load.image('wall', 'assets/wall16.png');
    this.load.image('ball', 'assets/zenikaball.png');
    this.load.image('block', 'assets/block.png');

    this.load.image('pnj-sample', 'assets/pnj-sample.png');

    this.load.spritesheet('button', 'assets/button_sprite_sheet.png', 193, 71);
  },
  create: function() {
  	this.state.start('Game');
  }
};
