var request = require('supertest'); /* Engine to test http requests */
describe("Chickmatic JSON API", function() {

   describe("Sets the scheduled period", function() {
    var server;
  	before(function (){
      server = require('../server');
    });
    after(function (){
    });
    var periodToSet = '{startLight:{hours:21,minutes:15},stopLight:{hours:21,minutes:18}}';
    var periodAsString = periodAsString;

    it("returns status 200 and saved info", function(done) {
      request(server.app).post("/scheduledperiod")
                         .send({startLight:{hours:21,minutes:15},stopLight:{hours:21,minutes:18}})
                         .expect(200)
                         .end(function(err, res) {
                         if (err) return done(err);
                           done();
                      });
                
    });
  });

  describe("Gets the scheduled period", function() {
    var server;
  	before(function (){
      server = require('../server');
    });
    after(function (){
    });

    it("returns status 200 and scheduled periods", function(done) {
      request(server.app).get("/scheduledperiod")
                     .expect(200)
                     .expect(function(response) {
                        var currentSchedule = JSON.parse(response.text);
                        if (currentSchedule.startLight.hours !== 21)
                          throw new Error("Start hour incorrect");
                        if (currentSchedule.stopLight.minutes !== 18)
                          throw new Error("Stop minute incorrect");
                      })
                    .end(function(err, res) {
                      if (err) return done(err);
                        done();
                    });
    });
  });

 describe("Adds a new temperature/humidity reading to file", function() {
    var server;
  	before(function (){
      server = require('../server');
    });
    after(function (){
    });

    it("returns status 200 and saved info", function(done) {
      request(server.app).post("/weather")
                         .send({ weather: "30;90;30;30;80" })
                         .expect(200)
                         .end(function(err, res) {
                         if (err) return done(err);
                        //TODO : Check if a new entry was saved to file
                           done();
                      });
    });
  });
});