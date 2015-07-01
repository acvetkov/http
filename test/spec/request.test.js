/*global assert, sinon, http*/
describe('request', function () {

    'use strict';

    var Request = http.Request;

    var request = new Request();
    var sandbox = sinon.sandbox.create();

    var clock;
    var fakeXhr;

    before(function () {
        clock = sinon.useFakeTimers();
    });

    after(function () {
        clock.restore();
        sandbox.restore();
    });

    function getLast(requests) {
        return requests[requests.length - 1];
    }

    describe('serialize', function () {

        it('should be defined', function () {
            assert.isFunction(request.serialize);
        });

        it('should correct serialize object to query string', function () {
            var queryObj = {
                param: 'value',
                param2: 'value2'
            };
            var expectedQuery = 'param=value&param2=value2';
            assert.equal(request.serialize(queryObj), expectedQuery);
        });

        it('should return an empty string for empty object', function () {
            assert.equal('', request.serialize({}));
        });
    });

    describe('deserialize', function () {

        it('should be defined', function () {
            assert.isFunction(request.deserialize);
        });

        it('should correct parse query string', function () {
            var queryString = 'param=value&param2=value2';
            var expectedObject = {
                param: 'value',
                param2: 'value2'
            };
            assert.deepEqual(expectedObject, request.deserialize(queryString));
        });

        it('should return an empty object for empty string', function () {
            assert.deepEqual({}, request.deserialize(''));
        });
    });

    describe('set', function () {

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

        it('should be defined', function () {
            assert.isFunction(request.set);
        });

        it('should set correct headers', function () {
            var expectedHeaders = {
                header: 'value'
            };
            new Request()
                .set('header', 'value')
                .get('url');
            assert.deepEqual(getLast(requests).requestHeaders, expectedHeaders);
        });

        it('should return link to request object', function () {
            var result = request.set('header', 'value');
            assert.equal(result, request);
        });
    });

    describe('type', function () {

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

        it('should be defined', function () {
            assert.isFunction(request.type);
        });

        it('should setup Content-Type header', function () {

            var expectedHeaders = {
                'Content-Type': http.ContentTypes.json
            };

            new Request()
                .type(http.ContentTypes.json)
                .get('http://my-site.com');

            assert.deepEqual(getLast(requests).requestHeaders, expectedHeaders);
        });

        it('should return link to request object', function () {
            assert.equal(request.type(http.ContentTypes.json), request);
        });
    });

    describe('params', function () {

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

        it('should be defined', function () {
            assert.isFunction(request.params);
        });

        it('should set correct query string', function () {
            var query = {
                param1: '1',
                param2: '2'
            };

            new Request()
                .params(query)
                .get('http://url');

            assert.deepEqual(getLast(requests).url, 'http://url?param1=1&param2=2');
        });

        it('should return link to request object', function () {
            assert.equal(request.params({}), request);
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

        it('should be defined', function () {
            assert.isFunction(request.data);
        });

        it('should setup request body', function () {
            var body = {
                param1: '1',
                param2: '2'
            };

            new Request()
                .data(body)
                .post('http://mysite/');

            assert.deepEqual(getLast(requests).requestBody, 'param1=1&param2=2');
        });

        it('should return link to request object', function () {
            assert.equal(request.data({}), request);
        });
    });

    describe('noCache', function () {

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

        it('should be defined', function () {
            assert.isFunction(request.noCache);
        });

        it('should setup if-modified header', function () {
            var expectedHeaders = {
                'If-Modified-Since': 'Sat, 1 Jan 2005 00:00:00 GMT'
            };

            new Request()
                .noCache()
                .get('http://my-site.com');

            assert.deepEqual(getLast(requests).requestHeaders, expectedHeaders);
        });

        it('should return link to request object', function () {
            assert.equal(request.noCache(), request);
        });
    });

    describe('auth', function () {

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

        it('should be defined', function () {
            assert.isFunction(request.auth);
        });

        it('should setup basic auth header', function () {
            var user = 'testUser';
            var pass = 'testPass';
            var hash = window.btoa(user + ':' + pass);
            var headerValue = 'Basic ' + hash;

            var expectedHeaders = {
                Authorization: headerValue
            };

            new Request()
                .auth(user, pass)
                .get('http://my-site.com');

            assert.deepEqual(getLast(requests).requestHeaders, expectedHeaders);
        });

        it('should return link to request object', function () {
            assert.equal(request.auth('123', '312'), request);
        });
    });

    describe('oauth', function () {

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

        it('should be defined', function () {
            assert.isFunction(request.oauth);
        });

        it('should append oauth header', function () {
            var token = '123';
            var expectedHeaders = {
                Authorization: 'OAuth 123'
            };

            new Request()
                .oauth(token)
                .get('http://my-site.com');

            assert.deepEqual(getLast(requests).requestHeaders, expectedHeaders);
        });

        it('should return link to request object', function () {
            assert.equal(request.oauth('123'), request);
        });
    });

    describe('setMethod', function () {

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

        it('should be defined', function () {
            assert.isFunction(request.setMethod);
        });

        it('should set GET method', function () {
            new Request()
                .setMethod('GET')
                .send();
            assert.equal(getLast(requests).method, 'GET');
        });

        it('should set POST method', function () {
            new Request()
                .setMethod('POST')
                .send();
            assert.equal(getLast(requests).method, 'POST');
        });

        it('should set PUT method', function () {
            new Request()
                .setMethod('PUT')
                .send();
            assert.equal(getLast(requests).method, 'PUT');
        });

        it('should set DELETE method', function () {
            new Request()
                .setMethod('DELETE')
                .send();
            assert.equal(getLast(requests).method, 'DELETE');
        });

        it('should return link to request object', function () {
            assert.equal(request.setMethod('GET'), request);
        });
    });

    describe('withCredentials', function () {

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

        it('should be defined', function () {
            assert.isFunction(request.withCredentials);
        });

        it('should send query with credentials', function () {
            new Request()
                .withCredentials()
                .get('http://my-site.com');

            assert.ok(getLast(requests).withCredentials);
        });

        it('should return link to request object', function () {
            assert.equal(request.withCredentials(), request);
        });
    });

    describe('responseType', function () {

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

        it('should set response type', function () {
            new Request()
                .responseType(http.ResponseTypes.JSON)
                .get('http://my-site.com');

            assert.ok(getLast(requests).responseType, http.ResponseTypes.JSON);
        });

        it('should return link to request object', function () {
            assert.equal(request.responseType(), request);
        });
    });

    describe('setUrl', function () {

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

        it('should be defined', function () {
            assert.isFunction(request.setUrl);
        });

        it('should set url', function () {
            var domain = 'http://my-site.com';
            new Request()
                .setUrl(domain)
                .send();
            assert.equal(getLast(requests).url, domain);
        });

        it('should return link to request object', function () {
            assert.equal(request.setUrl(), request);
        });
    });

    describe('field', function () {

        it('should be defined', function () {
            assert.isFunction(request.field);
        });

        it('should return link to request object', function () {
            assert.equal(request.field('1', '2'), request);
        });
    });

    describe('blob', function () {

        it('should be defined', function () {
            assert.isFunction(request.blob);
        });

        it('should return link to request object', function () {
            assert.equal(request.blob({}), request);
        });
    });

    describe('timeout', function () {

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

        it('should be defined', function () {
            assert.isFunction(request.timeout);
        });

        it('should abort XMLHttpRequest', function () {
            new Request()
                .timeout(100)
                .get('http://my-domain.com');

            console.log();

            assert.notOk(getLast(requests).aborted);
            clock.tick(101);
            assert.ok(getLast(requests).aborted);
        });

        it('should return link to request object', function () {
            assert.equal(request.timeout(10), request);
        });
    });

    describe('send', function () {

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

        it('should be defined', function () {
            assert.isFunction(request.send);
        });

        it('should send query', function () {
            assert.lengthOf(requests, 0);
            new Request()
                .send();
            assert.lengthOf(requests, 1);
        });

        it('should return link to request object', function () {
            assert.equal(request.send(), request);
        });
    });

    describe('abort', function () {

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

        it('should be defined', function () {
            assert.isFunction(request.abort);
        });

        it('should not call abort method of XMLHttpRequest', function () {
            new Request()
                .send();
            assert.notOk(getLast(requests).aborted);
        });

        it('should call abort method of XMLHttpRequest', function () {
            var request = new Request()
                .send();
            request.abort();
            assert.ok(getLast(requests).aborted);
        });

        it('should return link to request object', function () {
            assert.equal(request.abort(), request);
        });
    });

    describe('get', function () {

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

        it('should be defined', function () {
            assert.isFunction(request.get);
        });

        it('should send get query', function () {
            new Request()
                .get('http://my-domain.com');

            assert.equal(getLast(requests).method, http.HttpMethods.GET);
        });

        it('should return link to request object', function () {
            assert.equal(request.get('mydomain'), request);
        });
    });

    describe('post', function () {

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

        it('should be defined', function () {
            assert.isFunction(request.post);
        });

        it('should send get query', function () {
            new Request()
                .post('http://my-domain.com');

            assert.equal(getLast(requests).method, http.HttpMethods.POST);
        });

        it('should return link to request object', function () {
            assert.equal(request.post('mydomain'), request);
        });
    });

    describe('put', function () {

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

        it('should be defined', function () {
            assert.isFunction(request.put);
        });

        it('should send get query', function () {
            new Request()
                .put('http://my-domain.com');

            assert.equal(getLast(requests).method, http.HttpMethods.PUT);
        });

        it('should return link to request object', function () {
            assert.equal(request.put('mydomain'), request);
        });
    });

    describe('status', function () {

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

        it('should be defined', function () {
            assert.isNumber(request.status);
        });

        it('should serialize params to query string', function () {
            var query = {
                1: 2,
                3: 4
            };
            new Request()
                .params(query)
                .get('http://my-site.com');

            assert.equal(getLast(requests).url, 'http://my-site.com?1=2&3=4');
        });
    });

    describe('responseHeaders', function () {

        it('should be defined', function () {
            assert.isDefined(request.responseHeaders);
        });
    });

    describe('query', function () {

        it('should be defined', function () {
            assert.isString(request.query);
        });
    });

    describe('method', function () {

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

        it('should be defined', function () {
            assert.isString(request.method);
        });

        it('should return GET method', function () {
            var req = new Request().get('http://my-site.com');
            assert.equal(req.method, http.HttpMethods.GET);
        });

        it('should return POST method', function () {
            var req = new Request().post('http://my-site.com');
            assert.equal(req.method, http.HttpMethods.POST);
        });

        it('should return PUT method', function () {
            var req = new Request().put('http://my-site.com');
            assert.equal(req.method, http.HttpMethods.PUT);
        });
    });

    describe('requestType', function () {

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

        it('should be defined', function () {
            assert.isString(request.requestType);
        });

        it('should set html type', function () {
            var req = new Request()
                .type(http.ContentTypes.html)
                .get('http://my-site.com');
            assert.equal(req.requestType, http.ContentTypes.html);
        });

        it('should set json type', function () {
            var req = new Request()
                .type(http.ContentTypes.json)
                .get('http://my-site.com');
            assert.equal(req.requestType, http.ContentTypes.json);
        });

        it('should set xml type', function () {
            var req = new Request()
                .type(http.ContentTypes.xml)
                .get('http://my-site.com');
            assert.equal(req.requestType, http.ContentTypes.xml);
        });

        it('should set urlencoded type', function () {
            var req = new Request()
                .type(http.ContentTypes.urlencoded)
                .get('http://my-site.com');
            assert.equal(req.requestType, http.ContentTypes.urlencoded);
        });

        it('should set form type', function () {
            var req = new Request()
                .type(http.ContentTypes.form)
                .get('http://my-site.com');
            assert.equal(req.requestType, http.ContentTypes.form);
        });
    });

    describe('xhr', function () {

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

        it('should be defined', function () {
            assert.isObject(request.xhr);
        });

        it('should return link to XMLHttpRequest object', function () {
            var req = new Request().get('http://my-site.com');
            assert.equal(req.xhr, getLast(requests));
        });
    });

    describe('onProgress', function () {

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

        it('should be defined', function () {
            assert.isFunction(request.onProgress);
        });

        it('should set onprogress callback to XMLHttpRequest instance', function () {
            var handler = sandbox.spy();
            var req = new Request()
                .onProgress(handler)
                .get('http://my-site.com');

            assert.equal(req.xhr.onprogress, handler);
        });

        it('should not set onprogress callback to XMLHttpRequest instance', function () {
            var req = new Request()
                .onProgress(1)
                .onProgress('123')
                .onProgress(null)
                .onProgress({})
                .onProgress([])
                .get('http://my-site.com');

            assert.isUndefined(req.xhr.onprogress);
        });

        it('should return link to request object', function () {
            assert.equal(request.onProgress(), request);
        });
    });

    describe('onUpload', function () {

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

        it('should be defined', function () {
            assert.isFunction(request.onUpload);
        });

        it('should set upload.onload callback to XMLHttpRequest instance', function () {
            var handler = sandbox.spy();
            var req = new Request()
                .onUpload(handler)
                .get('http://my-site.com');

            assert.equal(req.xhr.upload.onload, handler);
        });

        it('should not set upload.onload callback to XMLHttpRequest instance', function () {
            var req = new Request()
                .onUpload(1)
                .onUpload('123')
                .onUpload(null)
                .onUpload({})
                .onUpload([])
                .get('http://my-site.com');

            assert.isUndefined(req.xhr.upload.onload);
        });

        it('should return link to request object', function () {
            assert.equal(request.onUpload(), request);
        });
    });

    describe('onUploadProgress', function () {

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

        it('should be defined', function () {
            assert.isFunction(request.onUploadProgress);
        });

        it('should set upload.onprogress callback to XMLHttpRequest instance', function () {
            var handler = sandbox.spy();
            var req = new Request()
                .onUploadProgress(handler)
                .get('http://my-site.com');

            assert.equal(req.xhr.upload.onprogress, handler);
        });

        it('should not set upload.onprogress callback to XMLHttpRequest instance', function () {
            var req = new Request()
                .onUploadProgress(1)
                .onUploadProgress('123')
                .onUploadProgress(null)
                .onUploadProgress({})
                .onUploadProgress([])
                .get('http://my-site.com');

            assert.isUndefined(req.xhr.upload.onprogress);
        });

        it('should return link to request object', function () {
            assert.equal(request.onUploadProgress(), request);
        });
    });
});