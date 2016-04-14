import request from 'request'
import webdriverio from 'webdriverio'
import browserScripts from './browser-scripts.js'

const jobDataProperties = ['name', 'tags', 'public', 'build', 'custom-data']

class AngularService {
    /**
     * initialize webdriverio
     */
    before(options) {
        webdriverio.apply(this, arguments);

        var client = this;
        var originalUrl = client.url.bind(client);

        client.addCommand('init', function (init, cb) {
            client.timeouts('script', 10 * 1000, cb);
        });
        client.addCommand('url', function (url, cb) {
            if (typeof url === 'function') {
                return originalUrl.apply(this, arguments);
            }

            originalUrl('about:blank')
                .execute(function () {
                    var url = arguments[0];
                    window.name = 'NG_DEFER_BOOTSTRAP!' + window.name;
                    window.location.assign(url);
                }, [url]);

            waitForLoad(function (err) {
                if (err) {
                    return cb(err);
                }

                client
                    .executeAsync(browserScripts.testForAngular, [20], function (err, res) {
                        if (err) {
                            return cb(err)
                        }

                        client.execute(function () {
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
                    originalUrl(function (err, url) {
                        if (url === 'about:blank') {
                            return cb(err, false);
                        }

                        cb(err, true)
                    });
                }
            }

        });
    }

    //  ['element', 'elements', 'title'].forEach(waitForAngularBefore);
    beforeCommand(command) {
        if (['element', 'elements', 'title'].contains(command)) {
            // is this call to waitForAngular correct?
            global.browser.execute(browserScripts.waitForAngular, ['ng-app'], done);
        }
    }

    // ['url', 'elementIdClick'].forEach(waitForAngularAfter);
    afterCommand(command) {
        if (['url', 'elementIdClick'].contains(command)) {
            global.browser.execute(browserScripts.waitForAngular, ['ng-app'], done);
        }
    }

    // waitForAngular(cb) {
    //     client.executeAsync(
    //         browserScripts.waitForAngular,
    //         [options.ngRoot],
    //         cb);
    // }

}

export default AngularService
