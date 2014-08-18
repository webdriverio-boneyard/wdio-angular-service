describe('a regular webdriverio client', function() {
  var webdriverio = require('webdriverio');
  var client;

  before(function(done) {
    client = webdriverio
      .remote(webdriverjsOptions)
      .init()
      .url('http://localhost:8000/test/app/app/index.html#/view1', done);
  });

  after(function(done) {
    client.end(done);
  });

  it('does not wait for angularjs when clicking', function(done) {
    client
      // wait for page load
      .pause(2000)
      .click('[href="#/view2"]')
      .getText('.ng-scope:nth-child(1)', function(err, text) {
        assert.equal(err, null);
        assert.equal(text, 'This is the partial for view 1.');
        done(err);
      });
  });
});
