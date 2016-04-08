describe('a regular webdriverio client', function () {
    var assert = require('assert');

    before(function () {
        browser.url('http://localhost:8000/test/app/app/index.html#/view1');
    });

    it('does not wait for angularjs when clicking', function () {
        browser.pause(2000);  // wait for page load

        browser.click('[href="#/view2"]');
        var text = browser.getText('.ng-scope:nth-child(1)');
        assert.equal(text, 'This is the partial for view 1.');
    });
});
