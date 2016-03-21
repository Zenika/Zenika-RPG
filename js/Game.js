var ZenikaRPG = ZenikaRPG || {};

//title screen
ZenikaRPG.Game = function(){};

ZenikaRPG.Game.prototype = {
  create: function() {
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
    // this.map.tilePosition.x = -(this.ship.body.x)+(this.game.width/2);
    // this.map.tilePosition.y = -(this.ship.body.y)+(this.game.height/2);

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
          // console.log('pos', self.ship.body.x, '-', self.ship.body.y);
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

                  if(self.questions.length === 10) {
                    self.start = false;
                    self.submitGame(self.remainingTime);
                  }
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
                        self.totalTime += 10 * 1000;
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
        // console.log('Should submit');
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
        // console.log('['+(parseFloat(this.game.input.mousePointer.x)+(-parseFloat(this.map.tilePosition.x))).toFixed(0)+', '+(parseFloat(this.game.input.mousePointer.y)+(-parseFloat(this.map.tilePosition.y))).toFixed(0)+'] , ');
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
    }
    else {
      this.ship.body.setZeroVelocity();
    }


    if (!this.game.camera.atLimit.x)
    {
        this.map.tilePosition.x = -(this.ship.body.x)+(this.game.width/2)
    }

    if (!this.game.camera.atLimit.y)
    {
        this.map.tilePosition.y = -(this.ship.body.y)+(this.game.height/2);
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

      this.ship.body.collides(this.wallCollisionGroup, function(body1, body2) { /*console.log('wall')*/ }, this);

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
  submitGame: function(remainingTime) {
    // console.log('Submit', remainingTime)
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
  },
  createWalls: function() {

    var elements = [];

    // Maison mileu
    element = this.game.add.sprite(0, 0, 'wall');
    this.game.physics.p2.enable(element, this.DEBUG);
    element.body.addPolygon( {} , [
      [1040, 985] , [1075, 955] , [1155, 955] , [1175, 925] ,  [1300, 925] ,  [1320, 955] ,  [1415, 955] ,  [1440, 985] ,
      [1440, 1310] ,  [1420, 1330] ,  [1340, 1330] ,  [1320, 1350] ,  [1170, 1350] ,  [1150, 1330] ,  [1060, 1330], [1040, 1310]
    ]);
    elements.push(element);

    // Pancarte
    element = this.game.add.sprite(0, 0, 'wall');
    this.game.physics.p2.enable(element, this.DEBUG);
    element.body.addPolygon( {} , [
      [1445, 1286] ,
      [1515, 1286] ,
      [1514, 1359] ,
      [1499, 1358] ,
      [1502, 1349] ,
      [1461, 1349] ,
      [1460, 1359] ,
      [1446, 1357]
    ]);
    elements.push(element);

    element = this.game.add.sprite(0, 0, 'wall');
    this.game.physics.p2.enable(element, this.DEBUG);
    element.body.addPolygon( {} , [
      [1495, 1255] ,
      [1471, 1253] ,
      [1470, 1236] ,
      [1472, 1235] ,
      [1472, 1120] ,
      [1461, 1104] ,
      [1462, 1047] ,
      [1504, 1047] ,
      [1504, 1102] ,
      [1490, 1120] ,
      [1490, 1121] ,
      [1491, 1235] ,
      [1494, 1236]
    ]);
    elements.push(element);

    element = this.game.add.sprite(0, 0, 'wall');
    this.game.physics.p2.enable(element, this.DEBUG);
    element.body.addPolygon( {} , [
      [323, 1614] ,
      [466, 1553] ,
      [491, 1551] ,
      [638, 1615] ,
      [637, 1825] ,
      [623, 1829] ,
      [624, 1918] ,
      [586, 1916] ,
      [583, 1949] ,
      [490, 1948] ,
      [489, 1913] ,
      [371, 1910] ,
      [369, 1918] ,
      [334, 1920] ,
      [337, 1829] ,
      [325, 1827] ,
      [320, 1823]
     ]);
    elements.push(element);

    element = this.game.add.sprite(0, 0, 'wall');
    this.game.physics.p2.enable(element, this.DEBUG);
    element.body.addPolygon( {} , [
      [694, 1734] ,
      [669, 1734] ,
      [669, 1710] ,
      [676, 1710] ,
      [675, 1600] ,
      [667, 1593] ,
      [661, 1585] ,
      [660, 1571] ,
      [656, 1567] ,
      [655, 1550] ,
      [665, 1539] ,
      [677, 1536] ,
      [690, 1535] ,
      [700, 1540] ,
      [709, 1550] ,
      [709, 1570] ,
      [705, 1569] ,
      [704, 1569] ,
      [702, 1582] ,
      [701, 1592] ,
      [701, 1593] ,
      [689, 1599] ,
      [690, 1710] ,
      [695, 1710]
     ]);
    elements.push(element);

    element = this.game.add.sprite(0, 0, 'wall');
    this.game.physics.p2.enable(element, this.DEBUG);
    element.body.addPolygon( {} , [
      [647, 1845] ,
      [670, 1842] ,
      [690, 1841] ,
      [716, 1846] ,
      [715, 1900] ,
      [691, 1900] ,
      [691, 1918] ,
      [671, 1918] ,
      [670, 1918] ,
      [670, 1898] ,
      [647, 1899]
     ]);
    elements.push(element);

    element = this.game.add.sprite(0, 0, 'wall');
    this.game.physics.p2.enable(element, this.DEBUG);
    element.body.addPolygon( {} , [
      [923, 2008] ,
      [931, 2014] ,
      [935, 2023] ,
      [936, 2023] ,
      [939, 2027] ,
      [952, 2038] ,
      [950, 2048] ,
      [950, 2049] ,
      [944, 2057] ,
      [943, 2057] ,
      [932, 2071] ,
      [931, 2072] ,
      [919, 2075] ,
      [909, 2076] ,
      [898, 2069] ,
      [890, 2063] ,
      [888, 2052] ,
      [890, 2038] ,
      [890, 2037] ,
      [891, 2037] ,
      [894, 2030] ,
      [895, 2028] ,
      [903, 2017] ,
      [904, 2013]
     ]);
    elements.push(element);

    // Pancarte
    element = this.game.add.sprite(0, 0, 'wall');
    this.game.physics.p2.enable(element, this.DEBUG);
    element.body.addPolygon( {} , [
      [2086, 2086] ,
      [2110, 2084] ,
      [2152, 2085] ,
      [2154, 2136] ,
      [2132, 2139] ,
      [2131, 2158] ,
      [2110, 2158] ,
      [2110, 2140] ,
      [2086, 2139]
     ]);
    elements.push(element);

    // Lampadaire
    element = this.game.add.sprite(0, 0, 'wall');
    this.game.physics.p2.enable(element, this.DEBUG);
    element.body.addPolygon( {} , [
      [2215, 1974] ,
      [2191, 1973] ,
      [2191, 1955] ,
      [2194, 1954] ,
      [2196, 1845] ,
      [2184, 1822] ,
      [2184, 1779] ,
      [2223, 1775] ,
      [2223, 1811] ,
      [2222, 1831] ,
      [2212, 1844] ,
      [2210, 1954] ,
      [2210, 1955] ,
      [2216, 1955]
     ]);
    elements.push(element);

    // Camion
    element = this.game.add.sprite(0, 0, 'wall');
    this.game.physics.p2.enable(element, this.DEBUG);
    element.body.addPolygon( {} , [
      [2002, 632] ,
      [2237, 631] ,
      [2238, 846] ,
      [2208, 867] ,
      [2202, 868] ,
      [2202, 869] ,
      [2197, 876] ,
      [2166, 879] ,
      [2160, 870] ,
      [1990, 868] ,
      [1987, 877] ,
      [1956, 878] ,
      [1949, 869] ,
      [1930, 869] ,
      [1922, 857] ,
      [1922, 701] ,
      [1926, 696] ,
      [1936, 696] ,
      [1938, 659] ,
      [1948, 650] ,
      [2000, 649]
     ]);
    elements.push(element);

    // Tonneau
    element = this.game.add.sprite(0, 0, 'wall');
    this.game.physics.p2.enable(element, this.DEBUG);
    element.body.addPolygon( {} , [
      [87, 1041] ,
      [97, 1027] ,
      [105, 1022] ,
      [135, 1019] ,
      [147, 1028] ,
      [148, 1031] ,
      [152, 1038] ,
      [153, 1096] ,
      [153, 1097] ,
      [148, 1108] ,
      [142, 1113] ,
      [141, 1115] ,
      [134, 1119] ,
      [106, 1118] ,
      [94, 1111] ,
      [93, 1110] ,
      [85, 1098]
     ]);
    elements.push(element);

    // Pancarte
    element = this.game.add.sprite(0, 0, 'wall');
    this.game.physics.p2.enable(element, this.DEBUG);
    element.body.addPolygon( {} , [
      [320, 725] ,
      [344, 725] ,
      [345, 721] ,
      [368, 721] ,
      [367, 726] ,
      [367, 727] ,
      [393, 726] ,
      [393, 783] ,
      [391, 783] ,
      [368, 780] ,
      [368, 797] ,
      [344, 797] ,
      [345, 783] ,
      [319, 783]
     ]);
    elements.push(element);

    // Pancarte
    element = this.game.add.sprite(0, 0, 'wall');
    this.game.physics.p2.enable(element, this.DEBUG);
    element.body.addPolygon( {} , [
      [485, 486] ,
      [554, 487] ,
      [554, 489] ,
      [554, 491] ,
      [554, 558] ,
      [539, 558] ,
      [539, 549] ,
      [500, 548] ,
      [500, 560] ,
      [484, 559]
     ]);
    elements.push(element);

    // Lampadaire
    element = this.game.add.sprite(0, 0, 'wall');
    this.game.physics.p2.enable(element, this.DEBUG);
    element.body.addPolygon( {} , [
      [499, 394] ,
      [459, 392] ,
      [459, 359] ,
      [460, 359] ,
      [468, 359] ,
      [469, 251] ,
      [459, 257] ,
      [440, 273] ,
      [440, 274] ,
      [423, 271] ,
      [403, 248] ,
      [402, 234] ,
      [443, 175] ,
      [444, 175] ,
      [464, 177] ,
      [467, 161] ,
      [493, 158] ,
      [494, 158] ,
      [496, 174] ,
      [515, 176] ,
      [559, 233] ,
      [558, 233] ,
      [553, 260] ,
      [534, 272] ,
      [517, 273] ,
      [503, 256] ,
      [490, 255] ,
      [489, 358] ,
      [498, 360]
     ]);
    elements.push(element);

    // Arbre
    element = this.game.add.sprite(0, 0, 'wall');
    this.game.physics.p2.enable(element, this.DEBUG);
    element.body.addPolygon( {} , [
      [934, 713] ,
      [907, 713] ,
      [890, 699] ,
      [888, 675] ,
      [901, 665] ,
      [910, 663] ,
      [905, 658] ,
      [897, 649] ,
      [894, 649] ,
      [893, 649] ,
      [885, 648] ,
      [884, 634] ,
      [890, 633] ,
      [890, 626] ,
      [879, 625] ,
      [879, 616] ,
      [879, 615] ,
      [888, 607] ,
      [891, 587] ,
      [906, 589] ,
      [917, 579] ,
      [919, 579] ,
      [920, 579] ,
      [928, 588] ,
      [929, 588] ,
      [930, 588] ,
      [950, 591] ,
      [950, 602] ,
      [950, 603] ,
      [959, 617] ,
      [959, 621] ,
      [951, 622] ,
      [949, 632] ,
      [950, 632] ,
      [955, 637] ,
      [955, 648] ,
      [942, 648] ,
      [931, 658] ,
      [931, 659] ,
      [930, 667] ,
      [941, 666] ,
      [949, 675] ,
      [950, 675] ,
      [950, 676] ,
      [950, 698] ,
      [937, 712]
     ]);
    elements.push(element);

    // Eau
    element = this.game.add.sprite(0, 0, 'wall');
    this.game.physics.p2.enable(element, this.DEBUG);
    element.body.addPolygon( {} , [
      [0, 1062] ,
      [63, 1062] ,
      [61, 1136] ,
      [140, 1139] ,
      [140, 1939] ,
      [221, 1943] ,
      [221, 2018] ,
      [302, 2018] ,
      [302, 2098] ,
      [545, 2100] ,
      [541, 2176] ,
      [813, 2179] ,
      [816, 2102] ,
      [971, 2097] ,
      [976, 2004] ,
      [970, 1919] ,
      [1425, 1915] ,
      [1438, 1928] ,
      [1436, 2000] ,
      [1423, 2007] ,
      [1423, 2099] ,
      [1503, 2100] ,
      [1501, 2178] ,
      [1662, 2178] ,
      [1661, 2258] ,
      [2059, 2257] ,
      [2061, 2400] ,
      [0, 2400]
     ]);
    elements.push(element);

    element = this.game.add.sprite(0, 0, 'wall');
    this.game.physics.p2.enable(element, this.DEBUG);
    element.body.addPolygon( {} , [
        [2080, 2320] , [2160, 2320] ,
        [2160, 2240] , [2240, 2240] ,
        [2240, 2000] , [2320, 2000] ,
        [2320, 1920] , [2400, 1920] ,
        [2400, 2400] , [2080, 2400]
     ]);
    elements.push(element);

    // Barrière haut gauche
    element = this.game.add.sprite(0, 0, 'wall');
    this.game.physics.p2.enable(element, this.DEBUG);
    element.body.addPolygon( {} , [
        [0, 720] , [50, 720] ,
        [50, 1060] , [0, 1060]
     ]);
    elements.push(element);

    // Maison haut gauche 1
    element = this.game.add.sprite(0, 0, 'wall');
    this.game.physics.p2.enable(element, this.DEBUG);
    element.body.addPolygon( {} , [
        [70, 380] , [400, 380] ,
        [400, 710] , [70, 710]
     ]);
    elements.push(element);

    // Maison haut gauche 2
    element = this.game.add.sprite(0, 0, 'wall');
    this.game.physics.p2.enable(element, this.DEBUG);
    element.body.addPolygon( {} , [
        [560, 150] , [950, 150] ,
        [950, 560] , [560, 560]
     ]);
    elements.push(element);

    // Caisses
    element = this.game.add.sprite(0, 0, 'wall');
    this.game.physics.p2.enable(element, this.DEBUG);
    element.body.addPolygon( {} , [
      [959, 241] ,
      [1039, 240] ,
      [1040, 255] ,
      [1099, 256] ,
      [1099, 359] ,
      [1069, 359] ,
      [1070, 421] ,
      [1069, 421] ,
      [989, 418] ,
      [990, 354] ,
      [988, 354] ,
      [960, 354]
     ]);
    elements.push(element);

    // Arbre
    element = this.game.add.sprite(0, 0, 'wall');
    this.game.physics.p2.enable(element, this.DEBUG);
    element.body.addPolygon( {} , [
      [1338, 357] ,
      [1337, 402] ,
      [1336, 402] ,
      [1325, 405] ,
      [1315, 422] ,
      [1307, 429] ,
      [1294, 428] ,
      [1293, 443] ,
      [1280, 457] ,
      [1261, 459] ,
      [1251, 473] ,
      [1229, 472] ,
      [1218, 458] ,
      [1199, 460] ,
      [1186, 445] ,
      [1184, 431] ,
      [1170, 428] ,
      [1155, 405] ,
      [1144, 402] ,
      [1141, 354] ,
      [1160, 337] ,
      [1162, 324] ,
      [1174, 314] ,
      [1174, 313] ,
      [1174, 302] ,
      [1198, 285] ,
      [1197, 273] ,
      [1218, 261] ,
      [1240, 257] ,
      [1264, 261] ,
      [1264, 262] ,
      [1285, 274] ,
      [1285, 275] ,
      [1284, 288] ,
      [1303, 300] ,
      [1304, 300] ,
      [1303, 314] ,
      [1303, 315] ,
      [1322, 327] ,
      [1318, 339]
     ]);
    elements.push(element);

    // Arbre
    element = this.game.add.sprite(0, 0, 'wall');
    this.game.physics.p2.enable(element, this.DEBUG);
    element.body.addPolygon( {} , [
        [560, 150] , [950, 150] ,
        [950, 560] , [560, 560]
     ]);
    elements.push(element);

    // Arbre
    element = this.game.add.sprite(0, 0, 'wall');
    this.game.physics.p2.enable(element, this.DEBUG);
    element.body.addPolygon( {} , [
      [1088, 1] ,
      [1103, 6] ,
      [1133, 26] ,
      [1148, 44] ,
      [1149, 59] ,
      [1149, 60] ,
      [1158, 74] ,
      [1175, 100] ,
      [1181, 131] ,
      [1144, 168] ,
      [1135, 171] ,
      [1134, 186] ,
      [1119, 204] ,
      [1101, 204] ,
      [1091, 218] ,
      [1090, 219] ,
      [1070, 219] ,
      [1056, 203] ,
      [1039, 204] ,
      [1024, 189] ,
      [1025, 171] ,
      [981, 129] ,
      [1000, 78] ,
      [1011, 59] ,
      [1014, 43] ,
      [1026, 27] ,
      [1069, 3]
     ]);
    elements.push(element);

    // Buisson haut gauche
    element = this.game.add.sprite(0, 0, 'wall');
    this.game.physics.p2.enable(element, this.DEBUG);
    element.body.addPolygon( {} , [
      [0, 0] ,
      [958, 0] ,
      [960, 45] ,
      [946, 62] ,
      [915, 79] ,
      [879, 79] ,
      [877, 123] ,
      [862, 140] ,
      [835, 155] ,
      [78, 158] ,
      [79, 205] ,
      [66, 223] ,
      [33, 238] ,
      [0, 239]
     ]);
    elements.push(element);

    // Buisson haut droite
    element = this.game.add.sprite(0, 0, 'wall');
    this.game.physics.p2.enable(element, this.DEBUG);
    element.body.addPolygon( {} , [
      [1284, 2] ,
      [2399, 3] ,
      [2399, 236] ,
      [2368, 236] ,
      [2322, 209] ,
      [2322, 159] ,
      [2286, 157] ,
      [2257, 142] ,
      [2241, 127] ,
      [2241, 126] ,
      [2241, 78] ,
      [1328, 77] ,
      [1294, 62] ,
      [1282, 45]
     ]);
    elements.push(element);

    // Tonneau
    element = this.game.add.sprite(0, 0, 'wall');
    this.game.physics.p2.enable(element, this.DEBUG);
    element.body.addPolygon( {} , [
      [2133, 141] ,
      [2145, 147] ,
      [2153, 161] ,
      [2153, 217] ,
      [2151, 229] ,
      [2137, 237] ,
      [2107, 239] ,
      [2095, 230] ,
      [2095, 231] ,
      [2085, 217] ,
      [2088, 162] ,
      [2093, 150] ,
      [2093, 149] ,
      [2107, 141]
     ]);
    elements.push(element);

    // Souche
    element = this.game.add.sprite(0, 0, 'wall');
    this.game.physics.p2.enable(element, this.DEBUG);
    element.body.addPolygon( {} , [
      [2175, 402] ,
      [2194, 411] ,
      [2214, 434] ,
      [2214, 435] ,
      [2214, 437] ,
      [2215, 457] ,
      [2217, 459] ,
      [2230, 477] ,
      [2227, 508] ,
      [2203, 527] ,
      [2181, 527] ,
      [2165, 518] ,
      [2142, 527] ,
      [2142, 528] ,
      [2120, 528] ,
      [2102, 516] ,
      [2095, 505] ,
      [2091, 477] ,
      [2107, 459] ,
      [2108, 436] ,
      [2120, 416] ,
      [2145, 400]
     ]);
    elements.push(element);

    // Arbre
    element = this.game.add.sprite(0, 0, 'wall');
    this.game.physics.p2.enable(element, this.DEBUG);
    element.body.addPolygon( {} , [
      [1899, 81] ,
      [1917, 93] ,
      [1928, 108] ,
      [1947, 111] ,
      [1985, 159] ,
      [1985, 160] ,
      [1980, 176] ,
      [1980, 177] ,
      [1981, 178] ,
      [2000, 202] ,
      [2000, 203] ,
      [1990, 240] ,
      [1956, 265] ,
      [1937, 277] ,
      [1922, 280] ,
      [1918, 290] ,
      [1903, 295] ,
      [1891, 300] ,
      [1871, 302] ,
      [1860, 293] ,
      [1845, 295] ,
      [1844, 294] ,
      [1837, 275] ,
      [1822, 273] ,
      [1821, 273] ,
      [1794, 255] ,
      [1786, 243] ,
      [1782, 241] ,
      [1767, 230] ,
      [1767, 231] ,
      [1762, 203] ,
      [1780, 176] ,
      [1773, 162] ,
      [1814, 112] ,
      [1833, 109] ,
      [1849, 88] ,
      [1864, 81]
     ]);
    elements.push(element);

    // Pancarte
    element = this.game.add.sprite(0, 0, 'wall');
    this.game.physics.p2.enable(element, this.DEBUG);
    element.body.addPolygon( {} , [
      [1766, 325] ,
      [1792, 325] ,
      [1789, 321] ,
      [1809, 321] ,
      [1810, 327] ,
      [1835, 326] ,
      [1835, 327] ,
      [1834, 377] ,
      [1810, 378] ,
      [1810, 400] ,
      [1810, 401] ,
      [1791, 400] ,
      [1790, 378] ,
      [1766, 379]
     ]);
    elements.push(element);

    // Maison haut droite
    element = this.game.add.sprite(0, 0, 'wall');
    this.game.physics.p2.enable(element, this.DEBUG);
    element.body.addPolygon( {} , [
      [1760, 3] ,
      [1760, 278] ,
      [1759, 279] ,
      [1754, 284] ,
      [1744, 285] ,
      [1746, 394] ,
      [1710, 395] ,
      [1710, 389] ,
      [1676, 389] ,
      [1676, 385] ,
      [1605, 385] ,
      [1605, 390] ,
      [1584, 388] ,
      [1585, 398] ,
      [1505, 397] ,
      [1505, 387] ,
      [1491, 387] ,
      [1490, 393] ,
      [1490, 394] ,
      [1455, 392] ,
      [1458, 305] ,
      [1446, 302] ,
      [1447, 303] ,
      [1446, 303] ,
      [1441, 297] ,
      [1444, 91] ,
      [1455, 81] ,
      [1456, 81] ,
      [1459, 81] ,
      [1466, 82] ,
      [1466, 62] ,
      [1469, 62] ,
      [1515, 62] ,
      [1515, 70] ,
      [1557, 66] ,
      [1558, 22] ,
      [1558, 25] ,
      [1611, 3]
     ]);
    elements.push(element);

    // Coline haut partie droite
    element = this.game.add.sprite(0, 0, 'wall');
    this.game.physics.p2.enable(element, this.DEBUG);
    element.body.addPolygon( {} , [
      [1607, 496] ,
      [1607, 550] ,
      [1685, 546] ,
      [1692, 602] ,
      [1725, 622] ,
      [1778, 632] ,
      [2256, 627] ,
      [2294, 613] ,
      [2313, 591] ,
      [2316, 567] ,
      [2317, 306] ,
      [2306, 265] ,
      [2282, 243] ,
      [2239, 225] ,
      [2224, 183] ,
      [2199, 161] ,
      [2159, 155] ,
      [1998, 154] ,
      [1987, 107] ,
      [1951, 78] ,
      [1926, 81] ,
      [1947, 111] ,
      [1987, 160] ,
      [1988, 161] ,
      [2164, 164] ,
      [2182, 173] ,
      [2183, 174] ,
      [2187, 234] ,
      [2189, 235] ,
      [2192, 239] ,
      [2193, 241] ,
      [2195, 246] ,
      [2249, 245] ,
      [2261, 256] ,
      [2269, 536] ,
      [2266, 566] ,
      [2255, 576] ,
      [1749, 576] ,
      [1736, 570] ,
      [1721, 512] ,
      [1682, 495]
     ]);
    elements.push(element);

    // Coline haut partie gauche
    element = this.game.add.sprite(0, 0, 'wall');
    this.game.physics.p2.enable(element, this.DEBUG);
    element.body.addPolygon( {} , [
      [1517, 495] ,
      [1517, 543] ,
      [1489, 551] ,
      [1448, 551] ,
      [1422, 547] ,
      [1421, 547] ,
      [1381, 531] ,
      [1369, 520] ,
      [1363, 488] ,
      [1366, 136] ,
      [1372, 107] ,
      [1398, 86] ,
      [1410, 81] ,
      [1441, 80] ,
      [1426, 89] ,
      [1419, 119] ,
      [1420, 483] ,
      [1432, 490] ,
      [1493, 496]
     ]);
    elements.push(element);

    // Maison bas droite
    element = this.game.add.sprite(0, 0, 'wall');
    this.game.physics.p2.enable(element, this.DEBUG);
    element.body.addPolygon( {} , [
        [1762, 1724] , [1960, 1601] , [2157, 1723] ,
        [2158, 1977] , [2143, 1977] , [2143, 2002] , [2133, 2001] ,
        [2132, 2077] , [1787, 2076] ,
        [1787, 2001] , [1779, 2002] , [1777, 1978] , [1762, 1977]
     ]);
    elements.push(element);

    // Coline bas droite
    element = this.game.add.sprite(0, 0, 'wall');
    this.game.physics.p2.enable(element, this.DEBUG);
    element.body.addPolygon( {} , [
        [1735, 1604] ,
        [1769, 1602] ,
        [1773, 1563] ,
        [1790, 1541] ,
        [1816, 1524] ,
        [2088, 1521] ,
        [2093, 1402] ,
        [2136, 1364] ,
        [2171, 1359] ,
        [2175, 1319] ,
        [2175, 1318] ,
        [2216, 1285] ,
        [2332, 1280] ,
        [2337, 1238] ,
        [2370, 1205] ,
        [2399, 1206] ,
        [2399, 1908] ,
        [2344, 1910] ,
        [2344, 1911] ,
        [2326, 1893] ,
        [2325, 1834] ,
        [2188, 1831] ,
        [2168, 1814] ,
        [2168, 1748] ,
        [1708, 1752] ,
        [1688, 1734] ,
        [1688, 1687] ,
        [1697, 1639]
     ]);
    elements.push(element);

    // Buisson et barrière droite
    element = this.game.add.sprite(0, 0, 'wall');
    this.game.physics.p2.enable(element, this.DEBUG);
    element.body.addPolygon( {} , [
        [2316, 1276] ,
        [2298, 1272] ,
        [2298, 730] ,
        [2328, 730] ,
        [2329, 731] ,
        [2330, 323] ,
        [2349, 303] ,
        [2375, 302] ,
        [2397, 322] ,
        [2396, 1196]
     ]);
    elements.push(element);

    // Fontaine
    element = this.game.add.sprite(600, 1160, 'wall');
    this.game.physics.p2.enable(element, this.DEBUG);
    element.body.setCircle(200);
    elements.push(element);

    elements.forEach(function(elem) {
      elem.alpha = 0;
      // // this.game.physics.p2.enable(elem, this.DEBUG);
      // elem.body.clearShapes();
      elem.body.static = true;
      elem.body.fixedRotation = true;
      elem.body.setCollisionGroup(this.wallCollisionGroup);
      elem.body.collides([this.boxCollisionGroup, this.ballCollisionGroup, this.playerCollisionGroup, this.wallCollisionGroup]);
    }, this);
  }
};
