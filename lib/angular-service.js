import request from 'request'
import webdriverio from 'webdriverio/build/lib/webdriverio'
import browserScripts from './browser-scripts.js'

const jobDataProperties = ['name', 'tags', 'public', 'build', 'custom-data']

class AngularService {
    /**
     * initialize webdriverio
     */
    before(options) {
        webdriverjs.apply(this, arguments);

        var client = this;
        var originalUrl = client.url.bind(client);

        patch('init', addTimeout);
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

    // TODO add the following mechanism
    //  ['element', 'elements', 'title'].forEach(waitForAngularBefore);

    // ['url', 'elementIdClick'].forEach(waitForAngularAfter);


    waitForAngularBefore(method) {
        var original = client[method];
        client.addCommand(method, function () {

            var originalArgs = arguments;

            waitForAngular(function () {
                original.apply(client, originalArgs);
            });
        });
    }

    waitForAngularAfter(method) {
        patch(method, waitForAngular);
    }

    patch(method, patchFn) {
        var original = client[method];

        client.addCommand(method, function () {
            var originalArgs = Array.prototype.slice.call(arguments);
            var cb = originalArgs.pop();

            originalArgs.push(function () {
                var responseArgs = arguments;

                patchFn(function () {
                    cb.apply(client, responseArgs);
                });
            });

            original.apply(client, originalArgs);
        });
    }

    waitForAngular(cb) {
        client.executeAsync(
            browserScripts.waitForAngular,
            [options.ngRoot],
            cb);
    }

    addTimeout(cb) {
        client.timeouts('script', 10 * 1000, cb);
    }
}

export default AngularService
