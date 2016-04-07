var ZenikaRPG = ZenikaRPG || {};

ZenikaRPG.BuilderPnjs = function () {
};

ZenikaRPG.BuilderPnjs.prototype = {
    create: function (game, boxCollisionGroup, collisionGroups, ship) {
        var questions = {};

        var categories = ['Web', 'DevOps', 'BigData', 'Agile', 'Craftsmanship', 'IOT', 'Java'];

        function buildQuestion(result, questionsCategory) {
            var question = {
                libelle: result.libelle,
                reponsePossibles: [],
                bonneReponse: result.bonne_reponse
            };
            question.reponsePossibles.push(result.reponse_1);
            question.reponsePossibles.push(result.reponse_2);
            question.reponsePossibles.push(result.reponse_3);
            question.reponsePossibles.push(result.reponse_4);

            questionsCategory.push(question);
        }

        categories.forEach(function (category) {
            questions[category] = [];

            if (!DEBUG) {
                $.getJSON("/api/questions/" + category, function (data) {
                        data.results.forEach(function (result) {
                            buildQuestion(result, questions[category]);
                        });
                    }
                );

            } else {
                var mockedResult = '{"results":[{"id":1,"type":"Web","index":1,"libelle":"Quelle est le principal défaut de AngularJS (V1) ?","reponse_1":"La productivité est faible","reponse_2":"La communauté n\'est pas active","reponse_3":"Le framework est trop complexe","reponse_4":"La création de composant n\'est pas simple","bonne_reponse":4}]}';
                JSON.parse(mockedResult).results.forEach(function (result) {
                    buildQuestion(result, questions[category]);
                });
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

        var i = 1;
        boxes.forEach(function (box) {
            this.createBox(game, boxCollisionGroup, collisionGroups, ship, box.x, box.y, box, i);
            i++;
        }, this);
    },
    createBox: function (game, boxCollisionGroup, collisionGroups, ship, x, y, box, i) {
        var interactionArea = game.add.sprite(x, y, 'pnj'+i);
        game.physics.p2.enable([interactionArea], COLLISION_DEBUG);
        interactionArea.body.static = true;
        interactionArea.body.setCircle(100);

        interactionArea.body.allowGoThrow = true;
        interactionArea.body.name = box.name;
        interactionArea.body.box = box;

        var pnj = game.add.sprite(x, y, 'pnj'+i);
        game.physics.p2.enable([pnj], COLLISION_DEBUG);
        pnj.body.static = true;
        pnj.body.setCollisionGroup(boxCollisionGroup);
        pnj.body.collides(collisionGroups);

        ship.uncounter[name] = false;
    }
};