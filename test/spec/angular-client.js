describe('an angular-compatible webdriverjs client', function () {
    var webdriverjsAngular = require('../../index.js');
    var assert = require('assert');
    //var timeToWait = 2000; - works
    var timeToWait = 0; // - doesn't work so far!

    before(function () {
        browser.url('http://localhost:8000/test/app/app/index.html#/view1');
        browser.pause(timeToWait);
    });

    it('waits for angularjs after clicking an element', function () {
        browser.click('[href="#/view2"]');
        browser.pause(timeToWait);
        var text = browser.getText('.ng-scope:nth-child(1)');
        assert.equal(text, 'This is the partial for view 2.');
    });

    it('waits for angular before searching for element', function () {
        browser.click('[href="#/view3"]');
        browser.pause(timeToWait);
        var res = browser.element('#an-element');
        assert.ok(res.value);
    });

    it('waits for angular before searching for elements', function () {
        browser.click('[href="#/view4"]')
        browser.pause(timeToWait);
        var res = browser.elements('.many-elements');
        assert.ok(res.value.length > 1);
    });

    it('waits for angular before searching for title', function () {
        browser.click('[href="#/view5"]')
        browser.pause(timeToWait);
        var title = browser.getTitle();
        assert.equal(title, 'HELLO MY FRIEND');
    });

    it('waits for angular after switching url manually', function () {
        browser.url('http://localhost:8000/test/app/app/index.html#/view6');
        browser.pause(timeToWait);
        var res = browser.execute(function () {
            return window.aglobal;
        });
        assert.equal(res.value, 'a global variable');
    });
});
