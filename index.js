module.exports = WebdriverjsAngular;

var webdriverjs = require('webdriverio/lib/webdriverio');
var inherits = require('util').inherits;
var browserScripts = require('./browser-scripts.js');

function WebdriverjsAngular(options) {
  webdriverjs.apply(this, arguments);

  var client = this;
  var originalUrl = client.url.bind(client);
  
  var withAngular = true;
  
  client.addCommand("withoutAngular", function(cb){
    withAngular = false;
    cb();
  });

  client.addCommand("withAngular", function(cb){
    withAngular = true;
    cb();
  });

  patch('init', addTimeout);
  client.addCommand('url', function(url, cb) {
    if (typeof url === 'function' || !withAngular) {
      return originalUrl.apply(this, arguments);
    }

    originalUrl('about:blank')
      .execute(function() {
        var url = arguments[0];
        window.name = 'NG_DEFER_BOOTSTRAP!' + window.name;
        window.location.assign(url);
      }, [url]);

    waitForLoad(function(err) {
      if (err) {
        return cb(err);
      }

      client
        .executeAsync(browserScripts.testForAngular, [20], function(err, res) {
          if (err) {
            return cb(err)
          }

          client.execute(function() {
            angular.resumeBootstrap();
          }, [], cb);
        });
    });

    function waitForLoad(cb) {
      var timeout;
      var cancelLoading = setTimeout(function hasTimeout() {
        timeout = true;
        cb(new Error('Timeout while waiting for page to load'));
      }, 10 * 1000);

      hasLoaded(function checkForLoad(err, res) {
        if (timeout === true) {
          return;
        }

        if (err) {
          clearTimeout(cancelLoading);
          return cb(err);
        }

        if (res === true) {
          clearTimeout(cancelLoading);
          return cb(null)
        }

        hasLoaded(checkForLoad);
      });

      function hasLoaded(cb) {
        originalUrl(function(err, url) {
          if (url === 'about:blank') {
            return cb(err, false);
          }

          cb(err, true)
        });
      }
    }

  });

  [ 'element', 'elements', 'title'].forEach(waitForAngularBefore);

  ['url', 'elementIdClick'].forEach(waitForAngularAfter);

  function waitForAngularBefore (method) {
    
    var original = client[method];
    client.addCommand(method, function(){

      var originalArgs = arguments;
      
      if (withAngular) {
        waitForAngular(function() {
          original.apply(client, originalArgs);
        });
      } else {
        original.apply(client, originalArgs);
      }

    });
  }

  function waitForAngularAfter (method) {
    patch(method, waitForAngular);
  }

  function patch(method, patchFn) {
    var original = client[method];

    client.addCommand(method, function() {
      var originalArgs = Array.prototype.slice.call(arguments);
      
      if (withAngular) {
        var cb = originalArgs.pop();

        originalArgs.push(function() {
          var responseArgs = arguments;

          patchFn(function() {
            cb.apply(client, responseArgs);
          });
        });

      }
      original.apply(client, originalArgs);
    });
  }

  function waitForAngular(cb) {
    client.executeAsync(
      browserScripts.waitForAngular,
      [options.ngRoot],
    cb);
  }

  function addTimeout(cb) {
    client.timeouts('script', 10 * 1000, cb);
  }
}

inherits(WebdriverjsAngular, webdriverjs);

WebdriverjsAngular.remote = function WebdriverjsAngularRemote(options) {
  return require('webdriverio').remote(options, WebdriverjsAngular);
}
