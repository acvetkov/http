(function () {

    'use strict';

    function factory(ContentTypes) {

        /**
         * Response Object
         * @param {Request} request
         * @constructor
         */
        var Response = function (request) {
            this.request = request;
            this.status = request.xhr.status;
            this.headers = {};

            this._setHeaders();
            this._setStatus();
        };

        Response.prototype = {

            /**
             * Setup response headers
             * @private
             */
            _setHeaders: function () {
                this.headers = this._parseHeaders(this.request.xhr.getAllResponseHeaders());
                this.headers['content-type'] = this.request.xhr.getResponseHeader('content-type');
            },

            /**
             * Parse response headers
             * @private
             */
            _parseHeaders: function (headers) {
                var lines = headers.split(/\r?\n/);
                var fields = {};
                var index;
                var field;
                var val;
                var lastElement = lines[lines.length - 1];

                if (lastElement.length < 3) {
                    lines.pop();
                }

                lines.forEach(function (line) {
                    index = line.indexOf(':');
                    field = line.slice(0, index).toLowerCase();
                    val = line.slice(index + 1).trim();
                    fields[field] = val;
                });

                return fields;
            },

            /**
             * Setup status
             * @private
             */
            _setStatus: function () {
                this._setCommonStatus();
                this._setDetailStatus();
            },

            /**
             * Response status
             * @private
             */
            _setCommonStatus: function () {

                var type = Math.floor(this.status / 100) || 0;

                this.aborted = Boolean(this.request.aborted);
                this.timeout = Boolean(this.request.timeoutExpired);

                this.info = type === 1;
                this.ok = type === 2;
                this.clientError = type === 4;
                this.serverError = type === 5;
                this.error = type === 4 || type === 5;
                this.success = this.status >= 200 && this.status < 300;
            },

            /**
             * Http status
             * @private
             */
            _setDetailStatus: function () {
                this.created = this.status === 201;
                this.accepted = this.status === 202;
                this.noContent = this.status === 204;

                this.badRequest = this.status === 400;
                this.unauthorized = this.status === 401;
                this.forbidden = this.status === 403;
                this.notFound = this.status === 404;
                this.notAcceptable = this.status === 406;
                this.toManyRequests = this.status === 429;
            },

            /**
             * Response Content-type
             * @returns {string}
             */
            get contentType() {
                var ct = this.headers['content-type'] || '';
                var targetType = '';
                Object.keys(ContentTypes).forEach(function (type) {
                    if (ct === ContentTypes[type]) {
                        targetType = ContentTypes[type];
                    }
                });
                return targetType;
            },

            /**
             * Response JSON
             * @returns {Object}
             */
            get json() {
                try {
                    return JSON.parse(this.request.xhr.responseText);
                } catch (e) {}

                return {};
            },

            /**
             * Response XML
             * @returns {*}
             */
            get xml() {
                return this.request.xhr.responseXML;
            },

            /**
             * Response data
             * @returns {*}
             */
            get data() {
                if (this.contentType === ContentTypes.json) {
                    return this.json;
                }
                if (this.contentType === ContentTypes.xml) {
                    return this.xml;
                }
                return this.request.xhr.responseText;
            },

            /**
             * XMLHttpRequest response
             * @returns {*}
             */
            get response() {
                return this.request.xhr.response;
            }
        };

        return Response;
    }

    module.exports = factory(require('./content-types'));

})();
