// Get the latest weather in the weather file
var fs = require('fs');
var lastLine = require('last-line');

// Add a new weather in the format timestamp;coopTemperature;coopHumidityPercent;
// coopLuminosity;outsideTemperature;outsideHumidityPercent for the 
// current date and time.
exports.addNewWeather = function(weatherData, config, env) {
    console.log("weather info:" + weatherData);
    if (weatherData == undefined) {
       console.log("No weather found");
       return;
    }
    var weatherEntry = Date.now() + ";" + weatherData + "\r\n";
    fs.appendFile(__dirname + "/" + config.weatherFile[env], weatherEntry, 'utf8', (error) => {
        if (error) 
	        return (console.log(error));
        });
    };

// Returns the last weather information
exports.getWeather = function(config, env) {
    var currentCoop = new Object();
    lastLine(__dirname + "/" + config.weatherFile[env], function (err, res) {
        if (res !== undefined) {
            var weatherInfo = res.split(';');
            // Format: timestamp;coopTemperature;coopHumidityPercent;coopLuminosity;outsideTemperature;outsideHumidityPercent
            currentCoop.currentCoopTemperature = weatherInfo[1];
            currentCoop.currentCoopHumidityPercent = weatherInfo[2];
            currentCoop.currentCoopLuminosity = weatherInfo[3];
            currentCoop.currentOutsideTemperature = weatherInfo[4];
            currentCoop.currentOutsideHumidityPercent = weatherInfo[5];
            }
        });
    return (currentCoop);
};

