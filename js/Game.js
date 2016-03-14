var ZenikaRPG = ZenikaRPG || {};

//title screen
ZenikaRPG.Game = function(){};

ZenikaRPG.Game.prototype = {
  create: function() {
    this.DEBUG = true;
  	//set world dimensions

    //background
    this.map = this.game.add.tilemap('map');

    this.map.addTilesetImage('tileset');
    this.map.addTilesetImage('wall');

    layerWall = this.map.createLayer('walls');
    layerGround = this.map.createLayer('ground');

    layerGround.resizeWorld();

    //  Set the tiles for collision.
    //  Do this BEFORE generating the p2 bodies below.
    this.map.setCollision(901, true, layerWall);

    //  Convert the tilemap layer into bodies. Only tiles that collide (see above) are created.
    //  This call returns an array of body objects which you can perform addition actions on if
    //  required. There is also a parameter to control optimising the map build.
    this.game.physics.p2.convertTilemap(this.map, layerWall);

    //create player
    this.createShip();

    //generate game elements
    this.createBalls();
    this.createBoxes();

    //  By default the ship will collide with the World bounds,
    //  however because you have changed the size of the world (via layer.resizeWorld) to match the tilemap
    //  you need to rebuild the physics world boundary as well. The following
    //  line does that. The first 4 parameters control if you need a boundary on the left, right, top and bottom of your world.
    //  The final parameter (false) controls if the boundary should use its own collision group or not. In this case we don't require
    //  that, so it's set to false. But if you had custom collision groups set-up then you would need this set to true.
    this.game.physics.p2.setBoundsToWorld(true, true, true, true, false);

    //  And before this will happen, we need to turn on impact events for the world
    this.game.physics.p2.setImpactEvents(true);

    //  Even after the world boundary is set-up you can still toggle if the ship collides or not with this:
    // ship.body.collideWorldBounds = false;
    this.cursors = this.game.input.keyboard.createCursorKeys();

    var timeoutFlag;
    var isTextDisplayed = false;

    this.game.physics.p2.setPostBroadphaseCallback(function (body1, body2) {

        var box;

        if(body1.ship){
            box = body2;
        } else if(body2.ship) {
            box = body1;
        }

        if (collideShip(body1, body2)) {
            if(!this.ship.uncounter[box.name]) {
              this.ship.uncounter[box.name] = true;
              this.ship.isAllowedToMove = false;
              button = this.game.add.button(280 - 95, 280, 'button', this.continue, this, 2, 1, 0);
              // context.game.add.button(game.width/2, game.height/4,
                      // 'ball', context.continue, this, 1, 0, 2);
            }
            if(!isTextDisplayed){
                isTextDisplayed = true;
                this.game.debug.text("Bonjour, je suis une boite !!! ("+box.name+")", 280, 280, '#efefef');
            }

            if(timeoutFlag){
               clearTimeout(timeoutFlag);
            }
            timeoutFlag = setTimeout(function () {
                timeoutFlag = undefined;
                this.game.debug.text("", 280, 280, '#efefef');
                isTextDisplayed = false;
            }, 1000 * 1, this);
            return false;
        }
        return true;
    }, this);

    function collideShip(body1, body2){
        if(body1.ship){
            return collideShipWithBox(body1, body2);
        } else if(body2.ship) {
            return collideShipWithBox(body2, body1);
        }
        return false
    }

    function collideShipWithBox(ship, body) {
        if(body.allowGoThrow){
            return true;
        }
        return false;
    }

    //show score
    // this.showLabels();
  },
  update: function() {
    this.ship.body.setZeroVelocity();

    if(this.ship.isAllowedToMove) {
      if (this.cursors.left.isDown) {
          this.ship.body.moveLeft(300);
      }
      else if (this.cursors.right.isDown) {
          this.ship.body.moveRight(300);
      }

      if (this.cursors.up.isDown) {
          this.ship.body.moveUp(300);
      }
      else if (this.cursors.down.isDown) {
          this.ship.body.moveDown(300);
      }
    }

  },
  continue: function() {
    this.ship.isAllowedToMove = true;
  },
  createShip: function() {
      this.ship = this.game.add.sprite(1286, 1461, 'ship');
      this.ship.scale.set(3);
      this.ship.smoothed = false;
      this.ship.animations.add('fly', [0, 1, 2, 3, 4, 5], 10, true);
      this.ship.play('fly');

      //player initial score of zero
      this.playerScore = 0;

      //  Create our physics body - a 28px radius circle. Set the 'false' parameter below to 'true' to enable debugging
      this.game.physics.p2.enable(this.ship, this.DEBUG);

      this.ship.body.setCircle(14 * 3);
      this.ship.body.ship = true;

      this.ship.isAllowedToMove = true;

      this.ship.uncounter = {};

      this.game.camera.follow(this.ship);
  },
  createBoxes: function(){
      this.createBox(900, 1380, 'Web');
      this.createBox(1040, 1600, 'Big Data');
      this.createBox(1210, 1700, 'DevOps');
      this.createBox(1450, 1700, 'Agile');
      this.createBox(1600, 1380, 'Craftmanship');
  },
  createBox: function(x, y, name) {
      block = this.game.add.sprite(x, y, 'block');
      this.game.physics.p2.enable([block], this.DEBUG);
      block.body.static = true;
      block.body.setCircle(100);
      block.body.allowGoThrow = true;
      block.body.name = name;

      var block2 = this.game.add.sprite(x, y, 'block');
      this.game.physics.p2.enable([block2], this.DEBUG);
      block2.body.static = true;
      block2.body.name = name;

      this.ship.uncounter[name] = false;

  },
  createBalls: function() {
      var balls = this.game.add.group();
      balls.enableBody = true;
      balls.physicsBodyType = Phaser.Physics.P2JS;

      for (var i = 0; i < 25; i++) {
          var ball = balls.create(this.game.world.randomX, this.game.world.randomY, 'ball');
          ball.body.setCircle(16);
      }
  }
};
