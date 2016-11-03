var ZenikaRPG = ZenikaRPG || {};

ZenikaRPG.Preload = function(){};

ZenikaRPG.Preload.prototype = {
  preload: function() {
    this.load.image('map', 'assets/map6.png');
    
    this.load.spritesheet('ship', 'assets/lego-spritesheet.png', 208/4, 264/4);
    this.load.image('wall', 'assets/wall16.png');
    this.load.image('ball', 'assets/lego-headball.png');
    this.load.image('block', 'assets/block.png');

    this.load.image('pnj-sample', 'assets/pnj-sample.png');
    this.load.image('pnj1', 'assets/pnj1.png');
    this.load.image('pnj2', 'assets/pnj2.png');
    this.load.image('pnj3', 'assets/pnj3.png');
    this.load.image('pnj4', 'assets/pnj4.png');
    this.load.image('pnj5', 'assets/pnj5.png');
    this.load.image('pnj6', 'assets/pnj6.png');
    this.load.image('pnj7', 'assets/pnj-sample.png');

    this.load.image('drone', 'assets/drone.png');

    this.load.spritesheet('button', 'assets/button_sprite_sheet.png', 193, 71);
  },
  create: function() {
  	this.state.start('Game');
  }
};
