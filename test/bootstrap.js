assert = require('assert');

if(process.env.TRAVIS_BUILD_NUMBER === undefined) {
  testCapabilities = {
    browserName: 'phantomjs'
  }
} else {
  testCapabilities = {
    browserName: process.env.BROWSER,
    'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
    name: 'webdriverjs-angular tests',
    build: process.env.TRAVIS_BUILD_NUMBER,
    username: process.env.SAUCE_USERNAME,
    accessKey: process.env.SAUCE_ACCESS_KEY
  }
}

testCapabilities['webdriver.remote.quietExceptions'] = true;