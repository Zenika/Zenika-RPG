var express = require('express');
var bodyParser = require('body-parser');
var pg = require('pg');

var app = express();

// set the port of our application
// process.env.PORT lets the port be set by Heroku
var port = process.env.PORT || 5000;
var databaseUrl = process.env.DATABASE_UR || 'postgres://postgres:postgres@localhost:5432/zenika-rpg';

app.use(bodyParser.json());
app.use(express.static('.'));

app.get('/test', function(request, response){
  console.log('Get');      // your JSON
  response.send({test: "Test"});    // echo the result back
});

app.use('/', express.static('.'));

app.post('/api/game', function(request, response){
  var data = request.body;

  pg.connect(databaseUrl, function(err, client, done) {
    if(!client) {
      return;
    }
    client.query(
      'INSERT into player (firstname, lastname, email, score, submit_date, duration) VALUES($1, $2, $3, $4, CURRENT_TIMESTAMP, $5) RETURNING id',
      [
        data.player.firstname,
        data.player.lastname,
        data.player.email,
        data.score,
        data.time
      ],
      function(err, result) {
        if (err) {
            console.log(err);
        } else {
          var playerId = result.rows[0].id;
          console.log('row inserted with id: ' + result.rows[0].id);

          data.questions.forEach(function(question) {
            client.query(
              'INSERT into reponse (f_player_id, type, index, question, reponse, bonne_reponse, temps_reponse) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id',
              [
                playerId,
                question.type,
                question.index,
                question.libelle,
                question.reponse,
                question.bonneReponse,
                question.tempsReponse
              ],
              function(err, result) {
                if (err) {
                  console.log(err);
                } else {
                  console.log('row inserted with id: ' + result.rows[0].id);
                }
              }
            );
          });

        }
      }
    );
  });

  console.log(request.body);      // your JSON
  response.status(201).send(request.body);    // echo the result back
});

app.get('/api/questions/:type', function (request, response) {
  pg.connect(databaseUrl, function(err, client, done) {
    if(!client) {
      return;
    }
    client.query('SELECT * FROM question where type=($1)', [request.params.type], function(err, result) {
      done();
      if (err)
       { console.error(err); response.send("Error " + err); }
      else
       { response.send({"results":result.rows}); }
    });
  });
});

app.get('/api/players/:email', function (request, response) {
  pg.connect(databaseUrl, function(err, client, done) {
    if(!client) {
      return;
    }
    client.query('SELECT * FROM player where email=($1)', [request.params.email], function(err, result) {
      done();
      if (err)
       { console.error(err); response.send("Error " + err); }
      else
       { response.send({"results":result.rows}); }
    });
  });
});

app.get('/db/reponses', function (request, response) {
  pg.connect(databaseUrl, function(err, client, done) {
    if(!client) {
      return;
    }
    client.query('SELECT * FROM reponse', function(err, result) {
      done();
      if (err)
       { console.error(err); response.send("Error " + err); }
      else
       { response.send({"results":result.rows}); }
    });
  });
});

app.get('/db/players', function (request, response) {
  pg.connect(databaseUrl, function(err, client, done) {
    if(!client) {
      return;
    }
    client.query('SELECT * FROM player', function(err, result) {
      done();
      if (err)
       { console.error(err); response.send("Error " + err); }
      else
       { response.send({"results":result.rows}); }
    });
  });
});

app.get('/db/questions', function (request, response) {
  pg.connect(databaseUrl, function(err, client, done) {
    if(!client) {
      return;
    }
    client.query('SELECT * FROM question', function(err, result) {
      done();
      if (err)
       { console.error(err); response.send("Error " + err); }
      else
       { response.send({"results":result.rows}); }
    });
  });
});

app.listen(port, function () {
  console.log('App listening on port '+port+'!');
});
