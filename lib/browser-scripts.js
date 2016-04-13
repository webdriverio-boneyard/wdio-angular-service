/**
* Theses functions will be executed in the browser
*/
var scripts = module.exports = {};

/**
* To be able to execute a regular function in the browser through selenium,
* the webdriverio does a waitForAngular.toString() then sends the resulting
* string-code through selenium, to the browsers.
* This is why we can't have named arguments, we must access arguments with
* .arguments
*/
scripts.waitForAngular = function(/* ngRoot, cb */) {
  var ngRoot = arguments[0];
  var cb = arguments[1];
  var el = document.querySelector(ngRoot);

  try {
    angular.element(el).injector().get('$browser').
        notifyWhenNoOutstandingRequests(cb);
  } catch (e) {
    cb(e);
  }
};

scripts.testForAngular = function(/* attempts, cb */) {
  var attempts = arguments[0];
  var cb = arguments[1];

  var done = function(res) {
    setTimeout(function() {
      cb(res);
    }, 0);
  };

  check(attempts);

  function check(n) {
    if (window.angular && window.angular.resumeBootstrap) {
      done([null, true]);
    } else if (n < 1) {
      if (window.angular) {
        done([new Error('angular never provided resumeBootstrap'), false]);
      } else {
        done([new Error('retries looking for angular exceeded'), false]);
      }
    } else {
      window.setTimeout(check, 500, n - 1);
    }
  }
}
