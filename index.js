module.exports = WebdriverjsAngular;

var webdriverjs = require('webdriverjs');
var partialRight = require('lodash.partialright');
var inherits = require('util').inherits;
var browserScripts = require('./browser-scripts.js');

function WebdriverjsAngular() {
  webdriverjs.apply(this, arguments);

  var client = this;

  patch('init', addTimeout);

  [ 'element', 'elements', 'title'].forEach(waitForAngularBefore);

  ['url', 'elementIdClick'].forEach(waitForAngularAfter);

  function waitForAngularBefore (method) {
    var original = client[method];
    client.addCommand(method, function(){

      var originalArgs = arguments;

      waitForAngular(function() {
        original.apply(client, originalArgs);
      });
    });
  }

  function waitForAngularAfter (method) {
    patch(method, waitForAngular);
  }

  function patch(method, patchFn) {
    var original = client[method];

    client.addCommand(method, function() {
      var originalArgs = Array.prototype.slice.call(arguments);
      var cb = originalArgs.pop();

      originalArgs.push(function() {
        var responseArgs = arguments;

        patchFn(function() {
          cb.apply(client, responseArgs);
        });
      });

      original.apply(client, originalArgs);
    });
  }

  function waitForAngular(cb) {
    client.executeAsync(
      browserScripts.waitForAngular,
      // 40 attemps, using `document` as ngRoot
      [40, 'document'],
    cb);
  }

  function addTimeout(cb) {
    client.timeouts('script', 20 * 1000, cb);
  }
}

inherits(WebdriverjsAngular, webdriverjs);

WebdriverjsAngular.remote = partialRight(webdriverjs.remote, WebdriverjsAngular);