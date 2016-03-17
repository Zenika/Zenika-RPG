var ZenikaRPG = ZenikaRPG || {};

//title screen
ZenikaRPG.Game = function(){};

ZenikaRPG.Game.prototype = {
  create: function() {
    this.DEBUG = false;
  	//set world dimensions

    //background
    this.map = this.game.add.tilemap('map');

    this.map.addTilesetImage('tileset');
    //this.map.addTilesetImage('wall');

    //this.layerWall = this.map.createLayer('walls');
    layerGround = this.map.createLayer('ground');

    // reprise des données de map4.json serais bien qu'elles restent dans le fichier
    var mapTiles = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220, 221, 222, 223, 224, 225, 226, 227, 228, 229, 230, 231, 232, 233, 234, 235, 236, 237, 238, 239, 240, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250, 251, 252, 253, 254, 255, 256, 257, 258, 259, 260, 261, 262, 263, 264, 265, 266, 267, 268, 269, 270, 271, 272, 273, 274, 275, 276, 277, 278, 279, 280, 281, 282, 283, 284, 285, 286, 287, 288, 289, 290, 291, 292, 293, 294, 295, 296, 297, 298, 299, 300, 301, 302, 303, 304, 305, 306, 307, 308, 309, 310, 311, 312, 313, 314, 315, 316, 317, 318, 319, 320, 321, 322, 323, 324, 325, 326, 327, 328, 329, 330, 331, 332, 333, 334, 335, 336, 337, 338, 339, 340, 341, 342, 343, 344, 345, 346, 347, 348, 349, 350, 351, 352, 353, 354, 355, 356, 357, 358, 359, 360, 361, 362, 363, 364, 365, 366, 367, 368, 369, 370, 371, 372, 373, 374, 375, 376, 377, 378, 379, 380, 381, 382, 383, 384, 385, 386, 387, 388, 389, 390, 391, 392, 393, 394, 395, 396, 397, 398, 399, 400, 401, 402, 403, 404, 405, 406, 407, 408, 409, 410, 411, 412, 413, 414, 415, 416, 417, 418, 419, 420, 421, 422, 423, 424, 425, 426, 427, 428, 429, 430, 431, 432, 433, 434, 435, 436, 437, 438, 439, 440, 441, 442, 443, 444, 445, 446, 447, 448, 449, 450, 451, 452, 453, 454, 455, 456, 457, 458, 459, 460, 461, 462, 463, 464, 465, 466, 467, 468, 469, 470, 471, 472, 473, 474, 475, 476, 477, 478, 479, 480, 481, 482, 483, 484, 485, 486, 487, 488, 489, 490, 491, 492, 493, 494, 495, 496, 497, 498, 499, 500, 501, 502, 503, 504, 505, 506, 507, 508, 509, 510, 511, 512, 513, 514, 515, 516, 517, 518, 519, 520, 521, 522, 523, 524, 525, 526, 527, 528, 529, 530, 531, 532, 533, 534, 535, 536, 537, 538, 539, 540, 541, 542, 543, 544, 545, 546, 547, 548, 549, 550, 551, 552, 553, 554, 555, 556, 557, 558, 559, 560, 561, 562, 563, 564, 565, 566, 567, 568, 569, 570, 571, 572, 573, 574, 575, 576, 577, 578, 579, 580, 581, 582, 583, 584, 585, 586, 587, 588, 589, 590, 591, 592, 593, 594, 595, 596, 597, 598, 599, 600, 601, 602, 603, 604, 605, 606, 607, 608, 609, 610, 611, 612, 613, 614, 615, 616, 617, 618, 619, 620, 621, 622, 623, 624, 625, 626, 627, 628, 629, 630, 631, 632, 633, 634, 635, 636, 637, 638, 639, 640, 641, 642, 643, 644, 645, 646, 647, 648, 649, 650, 651, 652, 653, 654, 655, 656, 657, 658, 659, 660, 661, 662, 663, 664, 665, 666, 667, 668, 669, 670, 671, 672, 673, 674, 675, 676, 677, 678, 679, 680, 681, 682, 683, 684, 685, 686, 687, 688, 689, 690, 691, 692, 693, 694, 695, 696, 697, 698, 699, 700, 701, 702, 703, 704, 705, 706, 707, 708, 709, 710, 711, 712, 713, 714, 715, 716, 717, 718, 719, 720, 721, 722, 723, 724, 725, 726, 727, 728, 729, 730, 731, 732, 733, 734, 735, 736, 737, 738, 739, 740, 741, 742, 743, 744, 745, 746, 747, 748, 749, 750, 751, 752, 753, 754, 755, 756, 757, 758, 759, 760, 761, 762, 763, 764, 765, 766, 767, 768, 769, 770, 771, 772, 773, 774, 775, 776, 777, 778, 779, 780, 781, 782, 783, 784, 785, 786, 787, 788, 789, 790, 791, 792, 793, 794, 795, 796, 797, 798, 799, 800, 801, 802, 803, 804, 805, 806, 807, 808, 809, 810, 811, 812, 813, 814, 815, 816, 817, 818, 819, 820, 821, 822, 823, 824, 825, 826, 827, 828, 829, 830, 831, 832, 833, 834, 835, 836, 837, 838, 839, 840, 841, 842, 843, 844, 845, 846, 847, 848, 849, 850, 851, 852, 853, 854, 855, 856, 857, 858, 859, 860, 861, 862, 863, 864, 865, 866, 867, 868, 869, 870, 871, 872, 873, 874, 875, 876, 877, 878, 879, 880, 881, 882, 883, 884, 885, 886, 887, 888, 889, 890, 891, 892, 893, 894, 895, 896, 897, 898, 899, 900];
    var collisionTiles = [901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 0, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 0, 0, 0, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 0, 0, 0, 0, 0, 901, 901, 901, 901, 901, 901, 901, 0, 0, 901, 901, 901, 901, 901, 0, 0, 901, 901, 901, 901, 0, 0, 0, 0, 0, 0, 0, 0, 901, 901, 901, 901, 901, 901, 901, 901, 901, 0, 901, 901, 901, 901, 901, 901, 0, 0, 0, 0, 0, 901, 901, 0, 901, 901, 0, 0, 0, 0, 901, 901, 901, 901, 901, 901, 901, 901, 901, 0, 0, 0, 0, 0, 0, 901, 0, 0, 0, 0, 0, 0, 0, 0, 0, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 0, 0, 0, 0, 0, 0, 901, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 901, 901, 901, 901, 901, 901, 901, 0, 0, 0, 901, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 901, 901, 901, 901, 901, 901, 901, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 901, 901, 901, 901, 901, 901, 901, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 901, 901, 901, 901, 901, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 901, 901, 0, 0, 0, 0, 0, 901, 901, 901, 0, 0, 0, 0, 901, 901, 901, 901, 901, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 901, 901, 901, 0, 0, 0, 901, 901, 901, 901, 901, 0, 0, 0, 901, 901, 901, 901, 901, 901, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 901, 901, 901, 0, 0, 0, 901, 901, 901, 901, 901, 0, 0, 0, 901, 901, 901, 901, 901, 901, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 901, 901, 901, 0, 0, 0, 901, 901, 901, 901, 901, 0, 0, 0, 901, 901, 901, 901, 901, 901, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 901, 901, 901, 0, 0, 0, 0, 901, 901, 901, 0, 0, 0, 0, 901, 901, 901, 901, 901, 901, 0, 0, 0, 0, 0, 0, 0, 0, 901, 901, 901, 901, 901, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 901, 901, 901, 901, 901, 901, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 901, 901, 901, 901, 901, 901, 0, 0, 901, 901, 901, 901, 901, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 0, 0, 901, 901, 901, 901, 901, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 0, 0, 901, 901, 901, 901, 901, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 0, 0, 901, 901, 901, 901, 901, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 0, 0, 901, 901, 901, 901, 901, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 0, 0, 0, 0, 0, 0, 0, 0, 0, 901, 901, 901, 901, 901, 901, 0, 0, 0, 0, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 0, 0, 0, 0, 0, 0, 0, 901, 901, 901, 901, 901, 901, 901, 0, 0, 0, 0, 901, 901, 901, 901, 901, 0, 901, 901, 901, 901, 901, 901, 901, 901, 901, 0, 0, 0, 901, 901, 901, 901, 901, 901, 901, 901, 901, 0, 0, 0, 0, 0, 0, 0, 901, 0, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 0, 0, 0, 0, 0, 0, 0, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901, 901];
    var collisions = [];
    for(var i = 0 ; i < collisionTiles.length ; i++){
        if(collisionTiles[i] == 901){
            collisions.push(mapTiles[i]);
        }
    }

    //  Set the tiles for collision.
    //  Do this BEFORE generating the p2 bodies below.
    this.map.setCollision(collisions, true, this.layerWall);

    //this.layerWall.setScale(5,5);
    layerGround.setScale(5,5);

    layerGround.resizeWorld();

    //  Convert the tilemap layer into bodies. Only tiles that collide (see above) are created.
    //  This call returns an array of body objects which you can perform addition actions on if
    //  required. There is also a parameter to control optimising the map build.
    this.game.physics.p2.convertTilemap(this.map, layerGround);

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

    var self = this;
    var timeoutFlag;
    var isTextDisplayed = false;
    var doingQuizz = false;

    self.totalTime = 1 * 60 * 1000;
    self.remainingTime = self.totalTime;
    self.ship.isAllowedToMove = false;

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
    // this.game.debug.text(this.ship.body.x +" - "+this.ship.body.y, 1280, 280, '#efefef');
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
    //this.game.debug.text(this.game.time.fps, 50, 50, '#efefef');

    if(this.ship.isAllowedToMove) {

      //  only move when you click
      if (this.game.input.pointer1.isDown)
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
    }
    else {
      this.ship.body.setZeroVelocity();
    }

  },
  createShip: function() {
      this.ship = this.game.add.sprite(1286, 1600, 'ship');
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
      });

      // for (var i = 0; i < 25; i++) {
      //     var ball = balls.create(this.game.world.randomX, this.game.world.randomY, 'ball');
      //     ball.body.setCircle(16);
      // }
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
  }
};
