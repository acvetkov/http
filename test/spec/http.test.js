/*global assert, sinon, http*/

var Request = http.Request;
var Response = http.Response;

describe('http', function () {

    'use strict';

    it('should define http', function () {
        assert.isObject(http);
    });

    it('should define Request', function () {
        assert.isFunction(Request);
    });

    it('should define Response', function () {
        assert.isFunction(Response);
    });

    it('should define HttpMethods enum', function () {
        assert.isObject(http.HttpMethods);
    });

    it('should define ContentTypes enum ', function () {
        assert.isObject(http.ContentTypes);
    });

    it('should define ResponseTypes enum ', function () {
        assert.isObject(http.ResponseTypes);
    });
});
