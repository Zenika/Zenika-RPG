var ZenikaRPG = ZenikaRPG || {};

ZenikaRPG.QuizSubmit = function () {
};

ZenikaRPG.restartTimeout = null;

ZenikaRPG.QuizSubmit.prototype = {
    submit: function (player, playerScore, remainingTime, questions, startGameCallback, stopGameCallback) {
        var data = {
            player: player,
            score: playerScore,
            time: remainingTime,
            questions: questions
        };

        $.ajax({
            url: '/api/game',
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (msg) {
            }
        });

        $('#timer').hide();
        $('#menu').hide();
        $('#submitGameWrapper').hide();
        $('#inputFirstname').val('');
        $('#inputLastname').val('');
        $('#inputEmail').val('');
        $("#menu div").removeClass("done");

        $("#startGameButton").unbind("click");
        $("#submitGame").unbind("click");

        $("#confirmation").show();
        $("#box").hide();
        if (remainingTime === 0) {
            $("#noTime").show();
        }
        else {
            $("#noTime").hide();
        }

        var self = this;
        $("#endGameButton").bind("click", function () {
            if(ZenikaRPG.restartTimeout){
                clearTimeout(ZenikaRPG.restartTimeout);
            }
            $("#endGameButton").unbind("click");
            $("#confirmation").hide();
            startGameCallback(data.score);
        });

        ZenikaRPG.restartTimeout = setTimeout(function(){
            $("#endGameButton").unbind("click");
            $("#confirmation").hide();
            startGameCallback(data.score);
        }, 10 * 1000);

        stopGameCallback();
    },
};