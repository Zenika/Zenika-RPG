var ZenikaRPG = ZenikaRPG || {};

//title screen
ZenikaRPG.Game = function(){};

ZenikaRPG.Game.prototype = {
  create: function() {
    this.DEBUG = true;

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

    //  This part is vital if you want the objects with their own collision groups to still collide with the world bounds
    //  (which we do) - what this does is adjust the bounds to use its own collision group.
    game.physics.p2.updateBoundsCollisionGroup();


    var map = game.add.tileSprite(0, 0, 2400, 2400, 'map');
    // map.tilePosition.x = 2072;
    // map.tilePosition.y = 1314;

    this.map = map;
    map.fixedToCamera = true;


        this.createWalls();
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
    // this.game.physics.p2.setBoundsToWorld(true, true, true, true, false);

    //  And before this will happen, we need to turn on impact events for the world
    // this.game.physics.p2.setImpactEvents(true);

    //  Even after the world boundary is set-up you can still toggle if the ship collides or not with this:
    // ship.body.collideWorldBounds = false;

    var self = this;
    var timeoutFlag;
    var isTextDisplayed = false;
    var doingQuizz = false;

    self.totalTime = 1 * 60 * 1000;
    self.remainingTime = self.totalTime;
    self.start = false;
    self.ship.isAllowedToMove = false;


        $('body').bind('click', function() {
          console.log('pos', self.ship.body.x, '-', self.ship.body.y);
        });

    if(!DEBUG){
      $('#newGame').show();
    }else{
      self.player = {
        firstname: 'test',
        lastname: 'test',
        email: 'email@test'
      };
      self.cursors = self.game.input.keyboard.createCursorKeys();
      self.ship.isAllowedToMove = true;
      self.questions = [];
    }

    if(!DEBUG){
      $('#startGameButton').click(function() {
        $('#formValidation').hide();
        var firstname = $('#inputFirstname').val();
        var lastname = $('#inputLastname').val();
        var email = $('#inputEmail').val();

        if(firstname && lastname && validateEmail(email)) {
          $.getJSON("/api/players/"+email, function(data) {
              if(data.results.length === 0) {
                $('#timer').html((this.remainingTime/1000).toFixed(1));
                $('#newGame').hide();
                $('#newGameButton').hide();
                $('#menu').show();
                self.player = {
                  firstname: firstname,
                  lastname: lastname,
                  email: email
                };
                self.cursors = self.game.input.keyboard.createCursorKeys();
                self.ship.isAllowedToMove = true;
                self.start = true;
                self.startTime = Date.now();
                self.questions = [];
              }
              else {
                $('#formValidation').show();
              }
            }
          );
        }
        else {
          $('#formValidation').show();
        }

        function validateEmail(email) {
          var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return re.test(email);
        }
      });
    }else{
      $('#timer').html((this.remainingTime/1000).toFixed(1));
      $('#newGame').hide();
      $('#newGameButton').hide();
      $('#menu').show();

      self.cursors = self.game.input.keyboard.createCursorKeys();
      self.ship.isAllowedToMove = true;
      self.start = true;
      self.startTime = Date.now();
      self.questions = [];
    }


    $('#submitGame').click(function() {
      self.start = false;
      self.submitGame(self.remainingTime);
    });

    function hideAll() {
      $('#box').hide();
      $('#quizz').hide();
      $('#question').hide();
      $('#done').hide();

      $("#continue").unbind("click");
      $("#quit").unbind("click");
      $("#takeQuizz").unbind("click");
    }


    this.game.physics.p2.setPostBroadphaseCallback(function (body1, body2) {

        var box = null;
        if(body1.ship){
            box = body2;
        } else if(body2.ship) {
            box = body1;
        }

        if (collideShip(body1, body2)) {
            if(!this.ship.uncounter[box.name]) {
              if(!doingQuizz && !isTextDisplayed) {
                // hideAll();
                $('#box').show();
                $('#quizz').show();
                $('#title').text(box.name);

                isTextDisplayed = true;


                var validate = function() {
                  hideAll();

                  self.ship.isAllowedToMove = true;
                  if(box) {
                    self.ship.uncounter[box.name] = true;
                    $("#offre"+box.name).addClass('done');
                  }
                  doingQuizz = false;
                  $("#continue").unbind("click");
                  $("#quit").unbind("click");
                  $("#takeQuizz").unbind("click");
                  box = null;
                }

                function showContinue() {
                  $('#question').hide();
                  $('#done').show();
                }

                function displayQuestion(box, questions, state) {
                  if(state >= questions.length) {
                    showContinue();
                    return;
                  }

                  var question = questions[state];
                  $('#questionLibelle').html(question.libelle);

                  var startTime = Date.now();

                  for(var i=1; i <= 4; i++) {
                    var reponseId = '#reponse'+i;
                    $(reponseId).unbind('click');
                  }

                  var i = 1;
                  question.reponsePossibles.forEach(function(reponse) {
                    var index = i;
                    var reponseId = '#reponse'+i;
                    $(reponseId).html(reponse);

                    $(reponseId).bind('click', function() {
                      var endTime = Date.now();
                      question.reponse = index;
                      var duration = endTime - startTime;
                      question.duration = duration;
                      state = state+1;
                      self.questions.push({
                        type: box.name,
                        index: state,
                        libelle: question.libelle,
                        reponse: index,
                        bonneReponse: question.bonneReponse,
                        tempsReponse: duration
                      });
                      if(question.reponse === question.bonneReponse) {
                        self.setPlayerScore(self.playerScore + 50);
                      }
                      displayQuestion(box, questions, state)
                    });
                    i++;
                  });
                }

                $('#quit').bind('click', function() {
                  hideAll();

                  self.ship.isAllowedToMove = true;
                  if(box) {
                    self.ship.uncounter[box.name] = false;
                  }
                  doingQuizz = false;
                  $("#continue").unbind("click");
                  $("#quit").unbind("click");
                  $("#takeQuizz").unbind("click");
                  box = null;
                });

                $('#takeQuizz').bind('click', function() {
                  doingQuizz = true;
                  $('#quizz').hide();
                  $('#done').hide();
                  self.ship.isAllowedToMove = false;

                  if(box.box.state < box.box.questions.length) {
                    $('#question').show();
                    displayQuestion(box, box.box.questions, box.box.state)
                  }
                  else {
                    showContinue();
                  }

                  $('#continue').bind('click', validate);

                });
              }

            }

            if(timeoutFlag){
               clearTimeout(timeoutFlag);
            }
            timeoutFlag = setTimeout(function () {
              if(!doingQuizz) {
                timeoutFlag = undefined;
                // this.game.debug.text("", 280, 280, '#efefef');
                hideAll();
                isTextDisplayed = false;
              }
            }, 100, this);
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
    // this.game.debug.text(this.ship.body.x +" - "+this.ship.body.y+" | "+this.map.tilePosition.x +" - "+this.map.tilePosition.y, 1280, 280, '#efefef');
    //this.game.debug.text(this.game.time.fps, 50, 50, '#efefef');
    if(this.start) {
      this.remainingTime = this.totalTime - (Date.now() - this.startTime);
      $('#timer').html((this.remainingTime/1000).toFixed(1));
      if(this.remainingTime <= 0) {
        console.log('Should submit');
        if(!DEBUG) {
          this.start = false;
          this.submitGame(this.remainingTime);
        }
        else {
          this.totalTime = 1 * 60 * 1000;
          this.startTime = Date.now();
        }
      }
    }

    if(this.ship.isAllowedToMove) {

      //  only move when you click
      if (this.game.input.activePointer.isDown)
      {
          //  400 is the speed it will move towards the mouse
          this.game.physics.arcade.moveToPointer(this.ship, 400);

          //  if it's overlapping the mouse, don't move any more
          if (Phaser.Rectangle.contains(this.ship.body, this.game.input.x, this.game.input.y))
          {
              // this.ship.body.velocity.setTo(0, 0);
                this.ship.body.setZeroVelocity();
          }
      }
      else
      {
          // this.ship.body.velocity.setTo(0, 0);
          this.ship.body.setZeroVelocity();

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

      if (!this.game.camera.atLimit.x)
      {
          this.map.tilePosition.x = -(this.ship.body.x)+(this.game.width/2)
      }
      else {
      }

      if (!this.game.camera.atLimit.y)
      {
          this.map.tilePosition.y = -(this.ship.body.y)+(this.game.height/2);
      }
    }
    else {
      this.ship.body.setZeroVelocity();
    }

  },
  createShip: function() {
      this.ship = this.game.add.sprite(1240, 1600, 'ship');
      this.ship.scale.set(3);
      this.ship.smoothed = false;
      this.ship.animations.add('fly', [0, 1, 2, 3, 4, 5], 10, true);
      this.ship.play('fly');

      //player initial score of zero
      this.setPlayerScore(0);

      //  Create our physics body - a 28px radius circle. Set the 'false' parameter below to 'true' to enable debugging
      this.game.physics.p2.enable(this.ship, this.DEBUG);

      this.ship.body.setCircle(14 * 3);
      this.ship.body.ship = true;
      //  Set the ships collision group
      this.ship.body.setCollisionGroup(this.playerCollisionGroup);

      this.ship.body.collides(this.ballCollisionGroup, function(body1, body2) {}, this);

      this.ship.body.collides(this.boxCollisionGroup, function(body1, body2) {}, this);

      this.ship.body.collides(this.wallCollisionGroup, function(body1, body2) {console.log('wall')}, this);

      this.ship.isAllowedToMove = false;

      this.ship.uncounter = {};

      this.game.camera.follow(this.ship);
  },
  setPlayerScore: function(score) {
    this.playerScore = score;
    $('#score').html(this.playerScore);
  },
  createBoxes: function(){

    var questions = {};

    var categories = ['Web', 'DevOps', 'BigData', 'Agile', 'Craftsmanship', 'IOT', 'Java'];

    categories.forEach(function(category) {
      questions[category] = [];

      if(!DEBUG){
        $.getJSON("/api/questions/"+category, function(data) {
            data.results.forEach(function(result) {
              var question = {
                libelle: result.libelle,
                reponsePossibles: [],
                bonneReponse: result.bonne_reponse
              };
              question.reponsePossibles.push(result.reponse_1);
              question.reponsePossibles.push(result.reponse_2);
              question.reponsePossibles.push(result.reponse_3);
              question.reponsePossibles.push(result.reponse_4);

              questions[category].push(question);
            });
          }
        );
      }
    });


    var boxes = [
      {
        x: 1892,
        y: 361,
        name: "Web",
        state: 0,
        questions: questions['Web']
      },
      {
        x: 2038,
        y: 2122,
        name: "BigData",
        state: 0,
        questions: questions['BigData']
      },
      {
        x: 1012,
        y: 483,
        name: "DevOps",
        state: 0,
        questions: questions['DevOps']
      },
      {
        x: 121,
        y: 770,
        name: "Agile",
        state: 0,
        questions: questions['Agile']
      },
      {
        x: 690,
        y: 1790,
        name: "Craftsmanship",
        state: 0,
        questions: questions['Craftsmanship']
      },
      {
        x: 2220,
        y: 930,
        name: "IOT",
        state: 0,
        questions: questions['IOT']
      },
      {
        x: 1380,
        y: 1382,
        name: "Java",
        state: 0,
        questions: questions['Java']
      }
    ];

    var self = this;
    boxes.forEach(function(box) {
      self.createBox(box.x, box.y, box);
    });
  },
  createBox: function(x, y, box) {
      block = this.game.add.sprite(x, y, 'block');
      this.game.physics.p2.enable([block], this.DEBUG);
      block.body.static = true;
      block.body.setCircle(100);

      block.body.allowGoThrow = true;
      block.body.name = box.name;
      block.body.box = box;

      var block2 = this.game.add.sprite(x, y, 'block');
      this.game.physics.p2.enable([block2], this.DEBUG);
      block2.body.static = true;
      block2.body.setCollisionGroup(this.boxCollisionGroup);
      block2.body.collides([this.boxCollisionGroup, this.ballCollisionGroup, this.playerCollisionGroup]);

      this.ship.uncounter[name] = false;

  },
  createBalls: function() {
      var balls = this.game.add.group();

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


      bs.forEach(function(ball) {
        ball.body.setCircle(16);
        //  Tell the panda to use the pandaCollisionGroup
        ball.body.setCollisionGroup(this.ballCollisionGroup);

        //  Pandas will collide against themselves and the player
        //  If you don't set this they'll not collide with anything.
        //  The first parameter is either an array or a single collision group.
        ball.body.collides([this.boxCollisionGroup, this.ballCollisionGroup, this.playerCollisionGroup, this.wallCollisionGroup]);
      }, this);

      // for (var i = 0; i < 25; i++) {
      //     var ball = balls.create(this.game.world.randomX, this.game.world.randomY, 'ball');
      //     ball.body.setCircle(16);
      // }
  },
  createWalls: function() {
    contra = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'wall16');
    contra.alpha = 0;

    this.game.physics.p2.enable(contra, this.DEBUG);
    contra.body.clearShapes();

    contra.body.static = true;
    contra.body.fixedRotation = true;

    contra.body.addPolygon( {} ,
      -160, -215 , -125, -245 , -45, -245 , -25, -275 ,  100, -275 ,  120, -245 ,  215, -245 ,  240, -215 ,
      240, 110 ,  220, 130 ,  140, 130 ,  120, 150 ,  -30, 150 ,  -50, 130 ,  -140, 130,  -160, 110  );

    contra.body.setCollisionGroup(this.wallCollisionGroup);
    contra.body.collides([this.boxCollisionGroup, this.ballCollisionGroup, this.playerCollisionGroup, this.wallCollisionGroup]);

    // var walls = this.game.add.group();
    // walls.enableBody = true;
    // walls.physicsBodyType = Phaser.Physics.P2JS;
    // // walls.body.setCollisionGroup(this.ballCollisionGroup);
    //
    // poly = new Phaser.Polygon(new Phaser.Point(200, 100), new Phaser.Point(350, 100), new Phaser.Point(375, 200), new Phaser.Point(150, 200));
    //
    // graphics = this.game.add.graphics(1300, 1600);
    // walls.add(graphics);
    // graphics.body.setCollisionGroup(this.wallCollisionGroup);
    // graphics.beginFill(0xFF33ff);
    // graphics.drawPolygon(poly.points);
    // graphics.endFill();
    // this.game.physics.p2.enable([graphics], this.DEBUG);
    //
    // graphics.body.collides([this.boxCollisionGroup, this.ballCollisionGroup, this.playerCollisionGroup, this.wallCollisionGroup]);
    //
    // console.log(this.wallCollisionGroup, poly);
  },
  submitGame: function(remainingTime) {
    var data = {
      player: this.player,
      score: this.playerScore,
      time: remainingTime,
      questions: this.questions
    };

    $.ajax({
      url: '/api/game',
      type: 'POST',
      data: JSON.stringify(data),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function(msg) {}
    });

    $('#menu').hide();
    this.setPlayerScore(0);
    this.ship.isAllowedToMove = false;
    $('#inputFirstname').val('');
    $('#inputLastname').val('');
    $('#inputEmail').val('');
    $("#menu div").removeClass("done");

    $("#startGameButton").unbind("click");
    $("#submitGame").unbind("click");

    this.game.state.start('Game', true, false, data.score);
  },
  render: function() {
    // this.game.debug.text(this.ship.body.x +" - "+this.ship.body.y+" | "+this.map.tilePosition.x +" - "+this.map.tilePosition.y, 1280, 280, '#efefef');
  }
};
