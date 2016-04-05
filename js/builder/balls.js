var ZenikaRPG = ZenikaRPG || {};

ZenikaRPG.BuilderBalls = function () {
};

ZenikaRPG.BuilderBalls.prototype = {
    create: function (game, ballCollisionGroup, collisionGroups) {
        var balls = game.add.group();

        balls.enableBody = true;
        balls.physicsBodyType = Phaser.Physics.P2JS;

        var bs = [];

        bs.push(balls.create(1013, 1606, 'ball'));
        bs.push(balls.create(872, 813, 'ball'));
        bs.push(balls.create(220, 988, 'ball'));
        bs.push(balls.create(280, 1063, 'ball'));
        bs.push(balls.create(1705, 1198, 'ball'));
        bs.push(balls.create(1881, 502, 'ball'));
        bs.push(balls.create(1270, 649, 'ball'));
        bs.push(balls.create(1570, 1989, 'ball'));
        bs.push(balls.create(277, 1822, 'ball'));
        bs.push(balls.create(1794, 1403, 'ball'));

        bs.forEach(function (ball) {
            ball.body.setCircle(16);
            ball.body.setCollisionGroup(ballCollisionGroup);
            ball.body.angle = Math.floor(Math.random() * 360);
            ball.body.collides(collisionGroups);
        }, this);
    },
};