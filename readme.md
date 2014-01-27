# webdriverjs-angular [![Build Status](https://travis-ci.org/webdriverjs/webdriverjs-angular.png?branch=master)](https://travis-ci.org/webdriverjs/webdriverjs-angular) [![Selenium Test Status](https://saucelabs.com/browser-matrix/webdriverjs-angular.svg)](https://saucelabs.com/u/webdriverjs-angular)

A [selenium webdriverjs](https://code.google.com/p/selenium/wiki/JsonWireProtocol) api
compatible with [angular.js](http://angularjs.org) applications.

Based on [camme/webdriverjs](https://github.com/camme/webdriverjs), you access
the same API commands but you never have to `.pause()` between actions.

## Usage

```js
var webdriverjsAngular = require('webdriverjs-angular');
var options = {
    desiredCapabilities: {
        browserName: 'chrome'
    }
};

webdriverjsAngular
    .remote(options)
    .init()
    .url('http://www.google.com')
    .title(function(err, res) {
        console.log('Title was: ' + res.value);
    })
    .end();
```

For more options, usage and API details, see
[camme/webdriverjs](https://github.com/camme/webdriverjs).

## Why another webdriverjs lib?

1. webdriverjs-angular is based on an existing lib, it's extending
[camme/webdriverjs](https://github.com/camme/webdriverjs).

2. webdriverjs-angular is designed to work well with angularJS applications.
AngularJS applications have a specific behavior that needs to be taken care
of to provide easy e2e testing.

## How

`webdriverjs-angular` automatically waits for angularjs to [be ready](https://github.com/angular/angular.js/blob/cf686285c22d528440e173fdb65ad1052d96df3c/src/ng/browser.js#L70).

So you just have to worry about what you want to do in your tests, not when
to do it.

## Why not use [angular/protractor](https://github.com/angular/protractor)?

Unlike [angular/protractor](https://github.com/angular/protractor) or
[sebv/wd-tractor](https://github.com/sebv/wd-tractor),
we do not enhance webdriverjs API with angularJS-related
command.

You will not find any `elementByNgBinding`, `addMockModule`,
`hasElementByNgRepeaterRow` or any other specific, angularJS-related methods.

We think your functionnal tests should be as framework-agnostic as possible.

If you need `elementByNgBinding`, just use regular
[camme/webdriverjs](https://github.com/camme/webdriverjs)
commands like `.element('[ng-binding=model]')`.

## Local testing

See [test/spec](test/spec).

```shell
# you need multiple terminal window

# start a standalone selenium server
npm install selenium-standalone phantomjs -g
start-selenium

# start web server
node test/app/scripts/web-server.js

# launch tests
npm test
```
