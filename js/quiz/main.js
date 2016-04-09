var ZenikaRPG = ZenikaRPG || {};

ZenikaRPG.Quiz = function () {
};

ZenikaRPG.Quiz.prototype = {
    build: function (stopPlayerCallback, resumePlayerCallback, updateCursorCallback, startGameCallback, debug) {
        this.setPlayerScore(0);

        var self = this;

        self.timeoutFlag = undefined;
        self.isTextDisplayed = false;
        self.doingQuizz = false;
        self.totalTime = 1 * 60 * 1000;
        self.remainingTime = self.totalTime;
        self.start = false;

        self.startGameCallback = startGameCallback;
        self.stopPlayerCallback = stopPlayerCallback;

        stopPlayerCallback();

        $('#timer').hide();
        $('#question').hide();

        if (!debug) {
            $('#newGame').show();
        } else {
            self.player = {
                firstname: 'test',
                lastname: 'test',
                email: 'email@test'
            };
            resumePlayerCallback();
            updateCursorCallback();
            self.questions = [];
        }

        if (!debug) {
            $('#startGameButton').click(function () {
                $('#formValidation').hide();
                var firstname = $('#inputFirstname').val();
                var lastname = $('#inputLastname').val();
                var email = $('#inputEmail').val();

                if (firstname && lastname && validateEmail(email)) {
                    $.getJSON("/api/players/" + email, function (data) {
                            if (data.results.length === 0) {
                                $('#timer').show();
                                $('#timer').html((self.remainingTime / 1000).toFixed(0));
                                $('#newGame').hide();
                                $('#newGameButton').hide();
                                $('#menu').show();
                                $('#submitGameWrapper').show();
                                self.player = {
                                    firstname: firstname,
                                    lastname: lastname,
                                    email: email
                                };
                                updateCursorCallback();
                                resumePlayerCallback();
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
        } else {
            $('#timer').html((self.remainingTime / 1000).toFixed(0));
            $('#newGame').hide();
            $('#newGameButton').hide();
            $('#menu').show();
            $('#submitGameWrapper').show();

            updateCursorCallback();
            resumePlayerCallback();
            self.start = true;
            self.startTime = Date.now();
            self.questions = [];
        }

        $('#submitGame').click(function () {
            self.start = false;
            self.submitGame();
        });
    },
    submitGame: function(){
        var self = this;
        new ZenikaRPG.QuizSubmit().submit(self.player, self.playerScore, self.remainingTime, self.questions,
            function (score) {
                self.startGameCallback(score);
            },
            function () {
                self.setPlayerScore(0);
                self.stopPlayerCallback();
            })
    },
    showQuestions: function (box, stopPlayerCallback, resumePlayerCallback, playerCounterCallback) {
        var self = this;
        if (!self.doingQuizz && !self.isTextDisplayed && !box.completed) {
            $('#box').show();
            $('#quizz').show();
            $('#title').text(box.name);

            this.isTextDisplayed = true;

            var validate = function () {
                self.hideAll();

                resumePlayerCallback();
                if (box) {
                    playerCounterCallback(true);
                    $("#offre" + box.name).addClass('done');
                }
                self.doingQuizz = false;
                $("#continue").unbind("click");
                $("#quit").unbind("click");
                $("#takeQuizz").unbind("click");
                box = null;

                if (self.questions.length === 10) {
                    self.start = false;
                    self.submitGame(self.remainingTime);
                }
            }

            function showContinue(box, questions, state) {
                box.completed = true;
                $('#question').hide();
                $('#done').show();
            }

            function displayQuestion(box, questions, state) {
                if (state >= questions.length) {
                    showContinue(box, questions, state);
                    return;
                }

                var question = questions[state];
                $('#questionLibelle').html(question.libelle);

                var startTime = Date.now();

                for (var i = 1; i <= 4; i++) {
                    var reponseId = '#reponse' + i;
                    $(reponseId).unbind('click');
                }

                if(question.bonneReponse == 0){
                    $('#question #reponses').hide();
                    $('#question #continuer').show();

                    $('#question #continue-reponses').unbind("click");
                    $('#question #continue-reponses').bind('click', function () {
                        self.totalTime += Math.round((10 * 1000));
                        displayQuestion(box, questions, state + 1)
                    });
                }else{
                    $('#question #reponses').show();
                    $('#question #continuer').hide();
                    var i = 1;
                    question.reponsePossibles.forEach(function (reponse) {
                        var index = i;
                        var reponseId = '#reponse' + i;
                        $(reponseId).html(reponse);

                        $(reponseId).bind('click', function () {
                            var endTime = Date.now();
                            question.reponse = index;
                            var duration = endTime - startTime;
                            question.duration = duration;
                            state = state + 1;
                            self.questions.push({
                                type: box.name,
                                index: state,
                                libelle: question.libelle,
                                reponse: index,
                                bonneReponse: question.bonneReponse,
                                tempsReponse: duration
                            });
                            if (question.reponse === question.bonneReponse) {
                                self.setPlayerScore(self.playerScore + 50);
                            }
                            self.totalTime += Math.round((10 * 1000) * (1 + 1 / duration));
                            displayQuestion(box, questions, state)
                        });
                        i++;
                    });
                }
            }

            $('#quit').bind('click', function () {
                self.hideAll();

                resumePlayerCallback();
                if (box) {
                    playerCounterCallback(false);
                }
                self.doingQuizz = false;
                $("#continue").unbind("click");
                $("#quit").unbind("click");
                $("#takeQuizz").unbind("click");
                box = null;
            });

            $('#takeQuizz').bind('click', function () {
                self.doingQuizz = true;
                $('#quizz').hide();
                $('#done').hide();
                stopPlayerCallback();

                if (box.box.state < box.box.questions.length) {
                    $('#question').show();
                    displayQuestion(box, box.box.questions, box.box.state)
                }
                else {
                    showContinue(box, box.box.questions, box.box.state);
                }

                $('#continue').bind('click', validate);
            });
        }
    },
    showQuestionsHidingManagement: function () {
        var self = this;
        if (self.timeoutFlag) {
            clearTimeout(self.timeoutFlag);
        }
        self.timeoutFlag = setTimeout(function () {
            if (!self.doingQuizz) {
                self.hideAll();
                self.timeoutFlag = undefined;
                self.isTextDisplayed = false;
            }
        }, 100, this);
    },
    hideAll: function () {
        $('#box').hide();
        $('#quizz').hide();
        $('#question').hide();
        $('#done').hide();

        $("#continue").unbind("click");
        $("#quit").unbind("click");
        $("#takeQuizz").unbind("click");
    },
    setPlayerScore: function (score) {
        this.playerScore = score;
        $('#score').html(this.playerScore);
    },
    updateTimer: function(){
        var self = this;
        if (self.start) {
            self.remainingTime = self.totalTime - (Date.now() - self.startTime);
            $('#timer').html((self.remainingTime / 1000).toFixed(0));
            if (self.remainingTime <= 10 * 1000) {
                $('#timer').addClass('time-limit');
            }
            if (self.remainingTime <= 0) {
                if (!DEBUG) {
                    self.start = false;
                    self.submitGame();
                }
                else {
                    self.totalTime = 1 * 60 * 1000;
                    self.startTime = Date.now();
                }
            }
        }
    }
};