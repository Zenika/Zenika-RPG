var ZenikaRPG = ZenikaRPG || {};

var IDE_HOOK = false;
var VERSION = '2.4.4';
var DEBUG = false;
var COLLISION_DEBUG = false;

var gameWidth = window.innerWidth;
var gameHeight = window.innerHeight;

function startGame() {
    ZenikaRPG.game = new Phaser.Game(gameWidth, gameHeight, Phaser.AUTO, '');
    ZenikaRPG.game.antialias = false;

    ZenikaRPG.game.state.add('Boot', ZenikaRPG.Boot);
    ZenikaRPG.game.state.add('Preload', ZenikaRPG.Preload);
    ZenikaRPG.game.state.add('MainMenu', ZenikaRPG.MainMenu);
    ZenikaRPG.game.state.add('Game', ZenikaRPG.Game);

    ZenikaRPG.game.state.start('Boot');
}

$.getJSON('/config', function (data) {
    if(!!data.debug){
        DEBUG = true;
        COLLISION_DEBUG = true;
    }else if(!!data.noDataBase){
        DEBUG = true;
        COLLISION_DEBUG = false;
    }
    startGame();
});
