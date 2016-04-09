var ZenikaRPG = ZenikaRPG || {};

//title screen
ZenikaRPG.Game = function () {
};

ZenikaRPG.Game.prototype = {
    create: function () {
        this.DEBUG = DEBUG;

        var game = this.game;
        game.world.setBounds(0, 0, 2400, 2400);

        game.physics.startSystem(Phaser.Physics.P2JS);
        game.physics.p2.defaultRestitution = 0.9;
        game.physics.p2.setImpactEvents(true);
        game.physics.p2.restitution = 0.8;

        //  Create our collision groups. One for the player, one for the pandas
        this.playerCollisionGroup = game.physics.p2.createCollisionGroup();
        this.ballCollisionGroup = game.physics.p2.createCollisionGroup();
        this.boxCollisionGroup = game.physics.p2.createCollisionGroup();
        this.wallCollisionGroup = game.physics.p2.createCollisionGroup();

        game.physics.p2.updateBoundsCollisionGroup();

        var map = game.add.tileSprite(0, 0, 2400, 2400, 'map');

        this.map = map;
        map.fixedToCamera = true;

        this.ship = new ZenikaRPG.BuilderPlayer().create(this.game, this.playerCollisionGroup, [this.boxCollisionGroup, this.ballCollisionGroup, this.wallCollisionGroup], COLLISION_DEBUG);
        new ZenikaRPG.BuilderWalls().create(this.game, this.wallCollisionGroup, [this.boxCollisionGroup, this.ballCollisionGroup, this.playerCollisionGroup, this.wallCollisionGroup], COLLISION_DEBUG);
        new ZenikaRPG.BuilderBalls().create(this.game, this.ballCollisionGroup, [this.boxCollisionGroup, this.ballCollisionGroup, this.playerCollisionGroup, this.wallCollisionGroup], COLLISION_DEBUG);
        new ZenikaRPG.BuilderPnjs().create(this.game, this.boxCollisionGroup, [this.boxCollisionGroup, this.ballCollisionGroup, this.playerCollisionGroup], this.ship, COLLISION_DEBUG)

        this.ship.isAllowedToMove = false

        var self = this;

        var quiz = new ZenikaRPG.Quiz();
        this.quiz = quiz;

        quiz.build(function(){
            self.ship.isAllowedToMove = false;
        },function(){
            self.ship.isAllowedToMove = true;
        }, function(){
            self.cursors = self.game.input.keyboard.createCursorKeys();
        }, function(score){
            self.game.state.start('Game', true, false, score);
        }, this.DEBUG);

        this.game.physics.p2.setPostBroadphaseCallback(function (body1, body2) {
            var box = null;
            if (body1.ship) {
                box = body2;
            } else if (body2.ship) {
                box = body1;
            }

            if (collideShip(body1, body2)) {
                if (!this.ship.uncounter[box.name]) {
                    quiz.showQuestions(box, function(){
                        self.ship.isAllowedToMove = false;
                    },function(){
                        self.ship.isAllowedToMove = true;
                    }, function(name, value){
                        self.ship.uncounter[box.name] = value;
                    })
                }

                quiz.showQuestionsHidingManagement();

                return false;
            }
            return true;
        }, this);

        function collideShip(body1, body2) {
            if (body1.ship) {
                return collideShipWithBox(body1, body2);
            } else if (body2.ship) {
                return collideShipWithBox(body2, body1);
            }
            return false
        }

        function collideShipWithBox(ship, body) {
            if (body.allowGoThrow) {
                return true;
            }
            return false;
        }
    },

    manageStop: function (ship) {
        if (ship.stopTimeout) {
            clearTimeout(ship.stopTimeout);
        }
        ship.stopTimeout = setTimeout(function () {
            ship.animations.stop(null, true);
        }, 100);
    },

    managePlay: function (ship, animation) {
        ship.play(animation);
        this.manageStop(ship);
    },

    update: function () {
        this.quiz.updateTimer();

        if (this.ship.isAllowedToMove) {
            //  only move when you click
            if (this.game.input.activePointer.isDown) {
                var inputx = this.game.input.worldX;
                var inputy = this.game.input.worldY;
                var playerx = this.ship.body.x;
                var playery = this.ship.body.y;

                var dx = inputx - playerx;
                var dy = inputy - playery;

                dx = dx * dx * 1.0;
                dy = dy * dy * 1.0;

                if (inputy < playery) {
                    if (dy > dx) {
                        this.managePlay(this.ship, 'top');
                    } else if (inputx < playerx) {
                        this.managePlay(this.ship, 'left');
                    } else {
                        this.managePlay(this.ship, 'right');
                    }
                } else {
                    if (dy > dx) {
                        this.managePlay(this.ship, 'down');
                    } else if (inputx < playerx) {
                        this.managePlay(this.ship, 'left');
                    } else {
                        this.managePlay(this.ship, 'right');
                    }
                }

                var moveX = 1;
                var moveY = 1;
                var moveFactor = 300;

                if (dx > dy) {
                    moveY = dy / dx;
                } else {
                    moveX = dx / dy;
                }

                this.ship.body.setZeroVelocity();

                if (inputy < playery) {
                    this.ship.body.moveUp(moveY * moveFactor);
                } else {
                    this.ship.body.moveDown(moveY * moveFactor);
                }

                if (inputx < playerx) {
                    this.ship.body.moveLeft(moveX * moveFactor);
                } else {
                    this.ship.body.moveRight(moveX * moveFactor);
                }
            }
            else {
                this.ship.body.setZeroVelocity();

                if (this.cursors.left.isDown) {
                    this.ship.body.moveLeft(300);
                    this.managePlay(this.ship, 'left');
                }
                else if (this.cursors.right.isDown) {
                    this.ship.body.moveRight(300);
                    this.managePlay(this.ship, 'right');
                }

                if (this.cursors.up.isDown) {
                    this.ship.body.moveUp(300);
                    this.managePlay(this.ship, 'top');
                }
                else if (this.cursors.down.isDown) {
                    this.ship.body.moveDown(300);
                    this.managePlay(this.ship, 'down');
                }
            }
        }
        else {
            this.ship.body.setZeroVelocity();
        }

        if (!this.game.camera.atLimit.x) {
            this.map.tilePosition.x = -(this.ship.body.x) + (this.game.width / 2)
        }

        if (!this.game.camera.atLimit.y) {
            this.map.tilePosition.y = -(this.ship.body.y) + (this.game.height / 2);
        }
    },
    render: function () {
        // this.game.debug.text(this.ship.body.x +" - "+this.ship.body.y+" | "+this.map.tilePosition.x +" - "+this.map.tilePosition.y, 1280, 280, '#efefef');
    }
};
