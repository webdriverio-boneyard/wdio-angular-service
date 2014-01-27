/**
* Theses functions will be executed in the browser
*/
var scripts = module.exports = {};

/**
* To be able to execute a regular function in the browser through selenium,
* the webdriverjs does a waitForAngular.toString() then sends the resulting
* string-code through selenium, to the browsers.
* This is why we can't have named arguments, we must access arguments with
* .arguments
*/
scripts.waitForAngular = function(/* attemps, ngRoot, cb */) {
  console.log(arguments);
  var attempts = arguments[0];
  var ngRoot = arguments[1];
  var seleniumCb = arguments[2];
  var cb = function() {
    setTimeout(seleniumCb, 77);
  };
  var el = document.querySelector(ngRoot) || document;

  check(attempts);

  function check(n) {
    if (window.angular &&
        window.angular.element(el) &&
        window.angular.element(el).injector() &&
        window.angular.element(el).injector().get('$browser')) {
      window
        .angular
        .element(el)
        .injector()
        .get('$browser')
        .notifyWhenNoOutstandingRequests(cb);
    } else if (n < 1) {
      cb(false);
    } else {
      setTimeout(check, 250, n - 1);
    }
  }
};