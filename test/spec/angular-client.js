describe('an angular-compatible webdriverjs client', function() {
  var webdriverjsAngular = require('../../index.js');

  var client;

  before(function(done) {
    client = webdriverjsAngular
      .remote(webdriverjsOptions)
      .init()
      .url('http://localhost:8000/test/app/app/index.html#/view1', done);
  });

  after(function(done) {
    client.end(done);
  });

  it('waits for angularjs after clicking an element', function(done) {
    client
      .click('[href="#/view2"]')
      .getText('.ng-scope:nth-child(1)', function(err, text) {
        assert.equal(err, null);
        assert.equal(text, 'This is the partial for view 2.');
        done(err);
      });
  });

  it('waits for angular before searching for element', function(done) {
    client
      .click('[href="#/view3"]')
      .element('#an-element', function(err, res) {
        assert.equal(err, null);
        assert.ok(res.value);
        done(err);
      });
  });

  it('waits for angular before searching for elements', function(done) {
    client
      .click('[href="#/view4"]')
      .elements('.many-elements', function(err, res) {
        assert.equal(err, null);
        assert.ok(res.value.length > 1);
        done(err);
      });
  });

  it('waits for angular before searching for title', function(done) {
    client
      .click('[href="#/view5"]')
      .title(function(err, res) {
        assert.equal(err, null);
        assert.equal(res.value, 'HELLO MY FRIEND');
        done(err);
      });
  });

  it('waits for angular after switching url manually', function(done) {
    client
      .url('http://localhost:8000/test/app/app/index.html#/view6')
      .execute(function() {
        return window.aglobal;
      }, function(err, res) {
        assert.equal(err, null);
        assert.equal(res.value, 'a global variable');
        done(err);
      });
  });
});