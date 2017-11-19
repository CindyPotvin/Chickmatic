var hbs = require('express-handlebars');
var handlebars  = require('./helpers/handlebars.js')(hbs);
var fs = require('fs');
var express = require('express');  /*Web framework for Node*/
var bodyParser = require('body-parser'); /* Parses incoming requests (for json)*/
var morgan  = require('morgan') /* Show access logs in console */
var app = express();

var config = require('./config.js');
var weather = require('./weather.js');

app.use(morgan('combined'));
app.use(express.static(__dirname + '/static'));
app.use(bodyParser.json())

app.engine('.html', handlebars.engine);
app.set('view engine', '.html');

// Application home, shows the dashboard
app.get('/', function (req, res, next) {
  try {
    var currentCoop = weather.getWeather(config, app.settings.env);
    // Open the file with the schedule information and load them
	fs.readFile( __dirname + "/" + config.scheduleFile[app.settings.env], 'utf8', function (error, data) {
	    if (error) 
            return console.log(error);
        var currentSchedule = JSON.parse(data);
        currentCoop.scheduledPeriod = currentSchedule;
        res.render('index', currentCoop);
        });
    } catch (e) {
        console.log(e);
        next(e);
    }
});

// Returns the periods in the schedule as a JSON string so the controller can get the data.
app.get('/scheduledperiod', function (request, response) {

    fs.readFile( __dirname + "/" + config.scheduleFile[app.settings.env], 'utf8', function (error, data) {
	    if (error) 
	        return console.log(error);

       response.end(data);
   });
})

// Adds a new period to the schedule
app.post('/scheduledperiod', function(request, response) {
	fs.readFile( __dirname + "/" + config.scheduleFile[app.settings.env], 'utf8', function (error, data) {
        if (error) 
	        return console.log(error);

        var period = request.body;
        period.timestamp = Date.now();
        var periodAsString = JSON.stringify(request.body);
        fs.writeFile( __dirname + "/" + config.scheduleFile[app.settings.env], periodAsString, 'utf8', function (error) {
	        if (error) 
	            return console.log(error);
            });
	    response.end(periodAsString);
        });
    });

// Adds the latest temperature and humidity to file
app.post('/weather', function(request, response) {
    var weatherData = request.body.weather;
    weather.addNewWeather(weatherData, config, app.settings.env);
    response.end();
    });

// Starts the application and listen to requests
var server = app.listen(4444, function () {
    console.log('Listening on http://localhost:' + (4444))
    });

exports.server = server;
exports.app = app;