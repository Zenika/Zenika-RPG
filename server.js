var express = require('express');
var bodyParser = require('body-parser');

var app = express();

// set the port of our application
// process.env.PORT lets the port be set by Heroku
var port = process.env.PORT || 5000;

app.use(bodyParser.json());

app.use('/', express.static('.'));

app.post('/api/game', function(request, response){
  console.log(request.body);      // your JSON
  response.status(201).send(request.body);    // echo the result back
});

app.listen(port, function () {
  console.log('App listening on port '+port+'!');
});
