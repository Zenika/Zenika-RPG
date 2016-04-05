var ZenikaRPG = ZenikaRPG || {};

ZenikaRPG.BuilderPlayer = function () {
};

ZenikaRPG.BuilderPlayer.prototype = {
    create: function (game, playerCollisionGroup, collisionGroups, debug) {
        var ship = game.add.sprite(1240, 1600, 'ship');
        ship.scale.set(3);
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
        ship.animations.add('top', [0, 2, 0, 10], animationFps, true);
        ship.animations.add('down', [5, 8, 5, 11], animationFps, true);
        ship.animations.add('left', [6, 3, 6, 9], animationFps, true);
        ship.animations.add('right', [1, 4, 1, 7], animationFps, true);
    }
};