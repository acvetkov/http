/*global define*/
(function () {

    'use strict';

    function factory(Request, Response, ResponseTypes, HttpMethods, ContentTypes) {

        return {
            Request: Request,
            Response: Response,
            ResponseTypes: ResponseTypes,
            HttpMethods: HttpMethods,
            ContentTypes: ContentTypes
        };
    }

    if (typeof define !== 'undefined' && define.amd) {
        return define([
            './request',
            './response',
            './response-types',
            './http-methods',
            './content-types'
        ], factory);
    }

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = factory(
            require('./request'),
            require('./response'),
            require('./response-types'),
            require('./http-methods'),
            require('./content-types')
        );
    }

})();
