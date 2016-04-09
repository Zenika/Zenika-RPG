var ZenikaRPG = ZenikaRPG || {};

ZenikaRPG.BuilderDrone = function () {
};

ZenikaRPG.BuilderDrone.prototype = {
    create: function (game) {
        var drone = game.add.sprite(-1000, -1000, 'drone');
        drone.scale.set(3);
        drone.smoothed = false;

        drone.show = function(ship){
            drone.x = ship.x - 176;
            drone.y = ship.y + 300;

            game.add.tween(drone).to({ y: ship.y }, 600, Phaser.Easing.Sinusoidal.InOut, true, 0, 0);
        }

        return drone
    }
};