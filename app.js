var express = require('express');
var bodyParser = require('body-parser');
var curse = require('./curse');

var app = express();
var port = process.env.PORT || 3000;

//attach the body-parser middleware 
app.use(bodyParser.urlencoded({ extended: true }));

//TODO: test route. REMOVE AFTER DEBUGGING
app.get('/', function(request, response) {
	response.status(200).send('Hello Good Sir!');
});

app.post('/curse', curse);

//wire up a very basic event handler
app.use(function (error, request, response, next) {
	console.error('Error Occured: ' + error.stack);
	response.status(500).send(error.message);
});

app.listen(port, function() {
	console.log('Fireflybot listening on port ' + port);
});