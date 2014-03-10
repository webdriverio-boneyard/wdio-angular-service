assert = require('assert');

if(process.env.TRAVIS_BUILD_NUMBER === undefined) {
  webdriverjsOptions = {
    desiredCapabilities: {
      browserName: process.env.BROWSER
    },
    port: 4444
  }
} else {
  // wait for saucelabs to repond to /timeouts calls
  // http://support.saucelabs.com/forums/21034924-Open-Sauce-Support
  // webdriverjsOptions = {
  //   desiredCapabilities: {
  //     browserName: process.env.BROWSER,
  //     'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
  //     name: 'webdriverjs-angular tests',
  //     build: process.env.TRAVIS_BUILD_NUMBER,
  //     username: process.env.SAUCE_USERNAME,
  //     accessKey: process.env.SAUCE_ACCESS_KEY
  //   },
  //   port: 4445
  // }
  webdriverjsOptions = {
    desiredCapabilities: {
      browserName: process.env.BROWSER
    },
    port: 4444
  }
}

webdriverjsOptions.desiredCapabilities['webdriver.remote.quietExceptions'] = true;
webdriverjsOptions.host = 'localhost';
webdriverjsOptions.ngRoot = 'body';