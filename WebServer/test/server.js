var request = require('supertest'); /* Engine to test http requests */
describe("Chickmatic JSON API", function() {

  describe("Gets the scheduled periods", function() {
    var server;
  	before(function (){
      server = require('../server');
    });
    after(function (){
    });

    it("returns status 200 and scheduled periods", function(done) {
      request(server.app).get("/ScheduledPeriods")
                     .expect(200)
                     .expect(function(response) {
                        var currentSchedules = JSON.parse(response.text);
                        if (currentSchedules.periods[0].startLight.hours !== 21)
                          throw new Error("Unexpected hour");
                      })
                    .end(function(err, res) {
                      if (err) return done(err);
                        done();
    });
    });
  });
  //TODO: Add a period
});