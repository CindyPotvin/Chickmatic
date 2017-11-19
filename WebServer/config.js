var config = {};

config.scheduleFile = {
  development: 'scheduledperiods.json',
  test: 'test/scheduledperiodstest.json'
};

config.weatherFile = {
  development: 'weather.csv',
  test: 'test/weather.csv'
};

module.exports = config;