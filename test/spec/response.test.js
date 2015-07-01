/*global assert, sinon, http*/

describe('response', function () {

    'use strict';

    var Request = http.Request;
    
    var headers = {
        'cache-control': 'private, max-age=300',
        'content-length': 756,
        'content-type': 'text/html; charset=utf-8',
        date: 'Tue, 19 May 2015 08:20:10 GMT',
        expires: 'Tue, 19 May 2015 08:25:10 GMT'
    };
    
    var fakeXhr;

    function getLast(requests) {
        return requests[requests.length - 1];
    }

    describe('headers', function () {

        var requests = [];

        before(function () {
            fakeXhr = sinon.useFakeXMLHttpRequest();
            fakeXhr.onCreate = function (xhr) {
                requests.push(xhr);
            };
        });

        after(function () {
            fakeXhr.restore();
        });

        it('should set correct response headers', function (done) {

            function loadHandler(response) {
                assert.equal(response.headers['content-type'], 'text/html; charset=utf-8');
                assert.equal(response.headers.date, 'Tue, 19 May 2015 08:20:10 GMT');
                assert.equal(response.headers.expires, 'Tue, 19 May 2015 08:25:10 GMT');

                done();
            }

            new Request()
                .get('http://my-site.com', loadHandler);

            getLast(requests).respond(200, headers, '');
        });
    });

    describe('status', function () {

        var requests = [];

        var statusList = [
            'success', 'ok', 'created', 'accepted', 'noContent', 'badRequest', 'unauthorized', 'notAcceptable',
            'toManyRequests', 'notFound', 'forbidden', 'aborted', 'timeout', 'info', 'clientError', 'serverError',
            'error'
        ];

        var inArray = function (list, item) {
            return list.indexOf(item) >= 0;
        };

        var assertStatus = function (response, okStatuses) {
            statusList.forEach(function (status) {
                if (inArray(okStatuses, status)) {
                    assert.ok(response[status]);
                } else {
                    assert.notOk(response[status]);
                }
            });
        };

        var beforeFunc = function (status, callback) {
            new Request()
                .get('http://my-site.com', callback);
            getLast(requests).respond(status);
        };

        before(function () {
            fakeXhr = sinon.useFakeXMLHttpRequest();
            fakeXhr.onCreate = function (xhr) {
                requests.push(xhr);
            };
        });

        after(function () {
            fakeXhr.restore();
        });

        it('should be ok', function () {
            beforeFunc(200, function (response) {
                assertStatus(response, ['ok', 'success']);
            });
        });

        it('should be created', function () {
            beforeFunc(201, function (response) {
                assertStatus(response, ['ok', 'created', 'success']);
            });
        });

        it('should be accepted', function () {
            beforeFunc(202, function (response) {
                assertStatus(response, ['ok', 'accepted', 'success']);
            });
        });

        it('should be noContent', function () {
            beforeFunc(204, function (response) {
                assertStatus(response, ['ok', 'noContent', 'success']);
            });
        });

        it('should be badRequest', function () {
            beforeFunc(400, function (response) {
                assertStatus(response, ['error', 'clientError', 'badRequest']);
            });
        });

        it('should be unauthorized', function () {
            beforeFunc(401, function (response) {
                assertStatus(response, ['error', 'clientError', 'unauthorized']);
            });
        });

        it('should be forbidden', function () {
            beforeFunc(403, function (response) {
                assertStatus(response, ['error', 'clientError', 'forbidden']);
            });
        });

        it('should be notFound', function () {
            beforeFunc(404, function (response) {
                assertStatus(response, ['error', 'clientError', 'notFound']);
            });
        });

        it('should be notAcceptable', function () {
            beforeFunc(406, function (response) {
                assertStatus(response, ['error', 'clientError', 'notAcceptable']);
            });
        });

        it('should be toManyRequests', function () {
            beforeFunc(429, function (response) {
                assertStatus(response, ['error', 'clientError', 'toManyRequests']);
            });
        });

        it('should be info', function () {
            beforeFunc(100, function (response) {
                assertStatus(response, ['info']);
            });
        });

        it('should be serverError', function () {
            beforeFunc(500, function (response) {
                assertStatus(response, ['serverError', 'error']);
            });
        });
    });

    describe('contentType', function () {

        var requests = [];

        before(function () {
            fakeXhr = sinon.useFakeXMLHttpRequest();
            fakeXhr.onCreate = function (xhr) {
                requests.push(xhr);
            };
        });

        after(function () {
            fakeXhr.restore();
        });

        it('should be defined', function (done) {

            function loadHandler(response) {
                assert.isString(response.contentType);
                done();
            }

            new Request()
                .get('http://my-site.com', loadHandler);
            getLast(requests).respond(200);
        });

        it('should return correct content-type', function (done) {
            function loadHandler(response) {
                assert.equal(response.contentType, http.ContentTypes.json);
                done();
            }

            new Request()
                .get('http://my-site.com', loadHandler);
            getLast(requests).respond(200, {
                'content-type': 'application/json'
            });
        });
    });

    describe('json', function () {

        var requests = [];

        before(function () {
            fakeXhr = sinon.useFakeXMLHttpRequest();
            fakeXhr.onCreate = function (xhr) {
                requests.push(xhr);
            };
        });

        after(function () {
            fakeXhr.restore();
        });

        it('should be defined', function (done) {

            function loadHandler(response) {
                assert.isObject(response.json);
                done();
            }

            new Request()
                .get('http://my-site.com', loadHandler);
            getLast(requests).respond(200, {}, '{\'data\': 123}');
        });

        it('should parse valid json', function (done) {
            function loadHandler(response) {
                assert.deepEqual(response.json, {
                    data: 123
                });
                done();
            }

            new Request()
                .get('http://my-site.com', loadHandler);
            getLast(requests).respond(200, {}, '{\"data\": 123}');
        });

        it('should return empty object for invalid json', function (done) {
            function loadHandler(response) {
                assert.deepEqual(response.json, {});
                done();
            }

            new Request()
                .get('http://my-site.com', loadHandler);
            getLast(requests).respond(200, {});
        });
    });

    describe('response', function () {

        var requests = [];

        before(function () {
            fakeXhr = sinon.useFakeXMLHttpRequest();
            fakeXhr.onCreate = function (xhr) {
                requests.push(xhr);
            };
        });

        after(function () {
            fakeXhr.restore();
        });

        it('should return response from request', function (done) {

            var textResponse = 'my-mega-response';

            function loadHandler(response) {
                assert.equal(response.response, textResponse);
                done();
            }

            new Request()
                .get('http://my-site.com', loadHandler);
            getLast(requests).respond(200, {}, textResponse);
        });
    });

    describe('xml', function () {

        var requests = [];

        before(function () {
            fakeXhr = sinon.useFakeXMLHttpRequest();
            fakeXhr.onCreate = function (xhr) {
                requests.push(xhr);
            };
        });

        after(function () {
            fakeXhr.restore();
        });

        it('should return xml from request', function (done) {

            var xml = '<data>123</data>';

            function loadHandler(response) {
                assert.equal(response.xml.querySelector('data').textContent, '123');
                done();
            }

            new Request()
                .get('http://my-site.com', loadHandler);
            getLast(requests).respond(200, {}, xml);
        });
    });

    describe('data', function () {

        var requests = [];

        before(function () {
            fakeXhr = sinon.useFakeXMLHttpRequest();
            fakeXhr.onCreate = function (xhr) {
                requests.push(xhr);
            };
        });

        after(function () {
            fakeXhr.restore();
        });

        it('should return json from request', function (done) {

            var json = '{\"data\": 123}';

            function loadHandler(response) {
                assert.deepEqual(response.data, {
                    data: 123
                });
                done();
            }

            new Request()
                .get('http://my-site.com', loadHandler);
            getLast(requests).respond(200, {
                'content-type': 'application/json'
            }, json);
        });

        it('should return empty object', function (done) {

            function loadHandler(response) {
                assert.deepEqual(response.data, {});
                done();
            }

            new Request()
                .get('http://my-site.com', loadHandler);
            getLast(requests).respond(200, {
                'content-type': 'application/json'
            });
        });

        it('should return empty object', function (done) {

            var xml = '<data>123</data>';

            function loadHandler(response) {
                assert.equal(response.xml.querySelector('data').textContent, '123');
                done();
            }

            new Request()
                .get('http://my-site.com', loadHandler);
            getLast(requests).respond(200, {
                'content-type': 'application/xml'
            }, xml);
        });

        it('should return responseText', function (done) {

            var text = '123123';

            function loadHandler(response) {
                assert.equal(response.data, text);
                done();
            }

            new Request()
                .get('http://my-site.com', loadHandler);
            getLast(requests).respond(200, {
                'content-type': 'unknown'
            }, text);
        });
    });

});