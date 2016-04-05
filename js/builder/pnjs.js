var ZenikaRPG = ZenikaRPG || {};

ZenikaRPG.BuilderPnjs = function () {
};

ZenikaRPG.BuilderPnjs.prototype = {
    create: function (game, boxCollisionGroup, collisionGroups, ship, debug) {
        var questions = {};

        var categories = ['Web', 'DevOps', 'BigData', 'Agile', 'Craftsmanship', 'IOT', 'Java'];

        categories.forEach(function (category) {
            questions[category] = [];

            if (!debug) {
                $.getJSON("/api/questions/" + category, function (data) {
                        data.results.forEach(function (result) {
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

        boxes.forEach(function (box) {
            this.createBox(game, boxCollisionGroup, collisionGroups, ship, box.x, box.y, box, debug);
        }, this);
    },
    createBox: function (game, boxCollisionGroup, collisionGroups, ship, x, y, box, debug) {
        var interactionArea = game.add.sprite(x, y, 'pnj-sample');
        game.physics.p2.enable([interactionArea], debug);
        interactionArea.body.static = true;
        interactionArea.body.setCircle(100);

        interactionArea.body.allowGoThrow = true;
        interactionArea.body.name = box.name;
        interactionArea.body.box = box;

        var pnj = game.add.sprite(x, y, 'pnj-sample');
        game.physics.p2.enable([pnj], debug);
        pnj.body.static = true;
        pnj.body.setCollisionGroup(boxCollisionGroup);
        pnj.body.collides(collisionGroups);

        ship.uncounter[name] = false;
    }
};