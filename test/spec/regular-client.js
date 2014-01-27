describe('a regular webdriverjs client', function() {
  var webdriverjs = require('webdriverjs');
  var client;

  before(function(done) {
    client = webdriverjs
      .remote(webdriverjsOptions)
      .init()
      .url('http://localhost:8000/test/app/app/index.html#/view1', done);
  });

  after(function(done) {
    client.end(done);
  });

  it('does not wait for angularjs when clicking', function(done) {
    client
      .click('[href="#/view2"]')
      .getText('.ng-scope:nth-child(1)', function(err, text) {
        assert.equal(err, null);
        assert.equal(text, 'This is the partial for view 1.');
        done(err);
      });
  });
});