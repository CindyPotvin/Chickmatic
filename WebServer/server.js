var handlebars = require('handlebars');  /*HTML templates, to use with express*/
var fs = require('fs');
var express = require('express');  /*Web framework for Node*/
var bodyParser = require('body-parser'); /* Parses incoming requests (for json)*/
var morgan  = require('morgan') /* Show access logs in console */
var app = express();

app.use(morgan('combined'));
app.use(express.static(__dirname + '/static'));
app.use(bodyParser.json())

// Application home, shows the dashboard
app.get('/', function (req, res, next) {
  try {
    var currentCoop;
    // Open the file with the schedule information and load them, along with mock data for the 
    // weather
	fs.readFile( __dirname + "/" + "scheduledperiods.json", 'utf8', function (error, data) {
	    if (error) 
            return console.log(error);
        var currentSchedules = JSON.parse(data);
        // TODO: Call arduino for meteo, or from database
        // http://blog.modulus.io/nodejs-and-sqlite
        currentCoop = {
            currentCoopTemperature: 40,
            currentCoopHumidityPercent: 50,
            currentCoopLuminosity: 20,
            currentOutsideTemperature: 30,
            currentOutsideHumidityPercent: 60,
            currentSchedulePeriods: currentSchedules.periods
        };
        });
    // Read the template for the dashboard and pass the information to display
    fs.readFile('index.html', 'utf-8', function(error, source) {
	    if (error) 
	        return console.log(error);

        var template = handlebars.compile(source);
        var html = template(currentCoop);
        res.send(html);
        });
    } catch (e) {
        console.log(e);
        next(e);
    }
});

// Returns the periods in the schedule as a JSON string so the controller can get the data.
app.get('/ScheduledPeriods', function (request, response) {
    fs.readFile( __dirname + "/" + "scheduledperiods.json", 'utf8', function (error, data) {
	    if (error) 
	        return console.log(error);
            
       response.end(data);
   });
})

// Adds a new period to the schedule
app.post('/scheduledperiod', function(request, response) {
	fs.readFile( __dirname + "/" + "scheduledperiods.json", 'utf8', function (error, data) {
        if (error) 
	        return console.log(error);

	    data = JSON.parse(data);
        data.periods.push(req.body);
        fs.writeFile( __dirname + "/" + "scheduledperiods.json", JSON.stringify(data), 'utf8', function (error) {
	        if (error) 
	            return console.log(error);
            });
	    response.end(JSON.stringify(data));
        });
    });

// Starts the application and listen to requests
app.listen(process.env.PORT || 4444, function () {
    console.log('Listening on http://localhost:' + (process.env.PORT || 4444))
    });