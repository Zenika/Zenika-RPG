var ZenikaRPG = ZenikaRPG || {};

ZenikaRPG.BuilderPlayer = function () {
};

ZenikaRPG.BuilderPlayer.prototype = {
    create: function (game, playerCollisionGroup, collisionGroups, debug) {
        var ship = game.add.sprite(1240*0.5, 1600*0.5, 'ship');
        ship.scale.set(2);
        ship.smoothed = false;

        this.buildAnimations(ship);
        ship.play('down');
        ship.animations.stop();

        game.physics.p2.enable(ship, debug);

        ship.body.setCircle(14 * 3);
        ship.body.ship = true;
        ship.body.fixedRotation = true;

        //  Set the ships collision group
        ship.body.setCollisionGroup(playerCollisionGroup);
        collisionGroups.forEach(function(collisionGroup){
            ship.body.collides(collisionGroup, function (body1, body2) {
            }, this);
        }, this)

        ship.isAllowedToMove = false;

        ship.uncounter = {};

        game.camera.follow(ship);

        return ship
    },
    buildAnimations: function(ship){
        var animationFps = 8;
        ship.animations.add('top', [12, 13, 14, 15], animationFps, true);
        ship.animations.add('down', [0, 1, 2, 3], animationFps, true);
        ship.animations.add('left', [4, 5, 6, 7], animationFps, true);
        ship.animations.add('right', [8, 9, 10, 11], animationFps, true);
    }
};