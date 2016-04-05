var ZenikaRPG = ZenikaRPG || {};

var IDE_HOOK = false;
var VERSION = '2.4.4';
var DEBUG = false;

var gameWidth = window.innerWidth;
var gameHeight = window.innerHeight;

ZenikaRPG.game = new Phaser.Game(gameWidth, gameHeight, Phaser.AUTO, '');
ZenikaRPG.game.antialias = false;

ZenikaRPG.game.state.add('Boot', ZenikaRPG.Boot);
ZenikaRPG.game.state.add('Preload', ZenikaRPG.Preload);
ZenikaRPG.game.state.add('MainMenu', ZenikaRPG.MainMenu);
ZenikaRPG.game.state.add('Game', ZenikaRPG.Game);

ZenikaRPG.game.state.start('Boot');
