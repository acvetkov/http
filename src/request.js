(function () {

    'use strict';

    function factory(Response, ResponseTypes, HttpMethods, ContentTypes) {

        /**
         * stub function
         */
        var stub = function () {};

        var isFunction = function (param) {
            return typeof param === 'function';
        };

        var isObject = function (param) {
            return typeof param === 'object' && !Array.isArray(param) && param !== null;
        };

        var isString = function (param) {
            return typeof param === 'string';
        };

        /**
         * Request object
         * @constructor
         */
        var Request = function () {
            this._xhr = null;
            this._formData = null;
            this._headers = {};
            this._params = {};
            this._data = {};
            this._url = '';
            this._responseType = ResponseTypes.DEFAULT;
            this._queryTimeout = 25000;
            this._withCredentials = false;
            this._method = HttpMethods.GET;
            this._requestType = ContentTypes.json;
            this._callback = stub;
            this._onProgress = stub();
            this._onUploadProgress = stub();
            this._onUpload = stub();
            this._timeoutId = 0;
        };

        Request.prototype = {

            /**
             * Setup header
             * @param {String} header
             * @param {String} value
             * @returns {Request}
             */
            set: function (header, value) {
                this._headers[header] = value;
                return this;
            },

            /**
             * Setup Content-type header
             * @param {ContentTypes} type
             * @returns {Request}
             */
            type: function (type) {
                this.set('Content-Type', ContentTypes[type] || type);
                this._requestType = type;
                return this;
            },

            /**
             * Setup queryString (GET-params)
             * @param {Object} params
             * @returns {Request}
             */
            params: function (params) {
                this._params = params;
                return this;
            },

            /**
             * Setup body
             * @param {Object} data
             * @returns {Request}
             */
            data: function (data) {
                this._data = data;
                return this;
            },

            /**
             * Setup If-Modified header
             * @returns {Request}
             */
            noCache: function () {
                this.set('If-Modified-Since', 'Sat, 1 Jan 2005 00:00:00 GMT');
                return this;
            },

            /**
             * Setup Basic Authentication header
             * @param {String} user
             * @param {String} password
             * @returns {Request}
             */
            auth: function (user, password) {
                var hash = window.btoa(user + ':' + password);
                this.set('Authorization', 'Basic ' + hash);
                return this;
            },

            /**
             * Setup OAuth authorization header
             * @param {String} token
             * @returns {Request}
             */
            oauth: function (token) {
                this.set('Authorization', 'OAuth {token}'.replace('{token}', token));
                return this;
            },

            /**
             * Setup request method
             * @param {String} method
             * @returns {Request}
             */
            setMethod: function (method) {
                this._method = method;
                return this;
            },

            /**
             * Setup query timeout
             * @param {Number} value
             * @returns {Request}
             */
            timeout: function (value) {
                this._queryTimeout = value;
                return this;
            },

            /**
             * Setup cross-origin flag
             * @returns {Request}
             */
            withCredentials: function () {
                this._withCredentials = true;
                return this;
            },

            /**
             * Setup request header
             * @param {String} url
             * @returns {Request}
             */
            setUrl: function (url) {
                if (isString(url)) {
                    this._url = url;
                }
                return this;
            },

            /**
             * Add field to FormData
             * @param {String} name
             * @param {*} value
             * @returns {Request}
             */
            field: function (name, value) {
                if (!this._formData) {
                    this._formData = new FormData();
                }
                this._formData.append(name, value);
                return this;
            },

            /**
             * Setup Blob as request body
             * @param {Blob} blob
             * @returns {Request}
             */
            blob: function (blob) {
                this._formData = blob;
                return this;
            },

            /**
             * Setup response type
             * @param {ResponseTypes} responseType
             * @returns {Request}
             */
            responseType: function (responseType) {
                this._responseType = responseType;
                return this;
            },

            /**
             * Subscribe on download progress event
             * @param {Function} callback
             * @returns {Request}
             */
            onProgress: function (callback) {
                if (isFunction(callback)) {
                    this._onProgress = callback;
                }
                return this;
            },

            /**
             * Subscribe on upload progress event
             * @param {Function} callback
             * @returns {Request}
             */
            onUploadProgress: function (callback) {
                if (isFunction(callback)) {
                    this._onUploadProgress = callback;
                }
                return this;
            },

            /**
             * Subscribe on upload event
             * @param {Function} callback
             * @returns {Request}
             */
            onUpload: function (callback) {
                if (isFunction(callback)) {
                    this._onUpload = callback;
                }
                return this;
            },

            /**
             * Abort request
             * @returns {Request}
             */
            abort: function () {
                if (this._xhr && this._xhr.readyState < 4) {
                    this._xhr.abort();
                }
                return this;
            },

            /**
             * Serialize object to query string
             * @param {Object} obj
             * @returns {String|Object}
             */
            serialize: function (obj) {
                if (!isObject(obj)) {
                    return obj;
                }
                var pairs = [];
                Object.keys(obj).forEach(function (key) {
                    pairs.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]));
                });
                return pairs.join('&');
            },

            /**
             * Deserialize query string to object
             * @param {String} url
             * @returns {Object}
             */
            deserialize: function (url) {
                var obj = {};
                var rule = /^https?.+\?(.+)/i;
                var pairs;
                var parts;

                if (isString(url) && url.length > 0) {
                    pairs = url.replace(rule, '$1').split('&');
                }

                if (pairs && pairs.length > 0) {
                    pairs.forEach(function (pair) {
                        parts = pair.split('=');
                        obj[decodeURIComponent(parts[0])] = decodeURIComponent(parts[1]);
                    });
                }
                return obj;
            },

            /**
             * GET-request
             * @param {String} url
             * @param {Function} [callback]
             */
            get: function (url, callback) {
                return this.setMethod(HttpMethods.GET)
                    .setUrl(url)
                    .send(callback);
            },

            /**
             * POST-request
             * @param {String} url
             * @param {Function} [callback]
             */
            post: function (url, callback) {
                return this.type(ContentTypes.urlencoded)
                    .setMethod(HttpMethods.POST)
                    .setUrl(url)
                    .send(callback);
            },

            /**
             * PUT-request
             * @param {String} url
             * @param {Function} [callback]
             */
            put: function (url, callback) {
                return this.setUrl(url)
                    .setMethod(HttpMethods.PUT)
                    .send(callback);
            },

            /**
             * Send request
             * @param {Function} [handler]
             */
            send: function (handler) {

                var url = this._createUrl();
                var body = this._createBody();

                this._createRequest();
                this._setCompleteHandler(handler);
                this._bindEvents();
                this._setupTimeout();
                this._openRequest(url);
                this._sendRequest(body);

                return this;
            },

            /**
             * Create XMLHttpRequest
             * @private
             */
            _createRequest: function () {
                this._xhr = new XMLHttpRequest();
            },

            /**
             * Setup onComplete handler
             * @param {Function} [handler]
             * @private
             */
            _setCompleteHandler: function (handler) {
                if (isFunction(handler)) {
                    this._callback = handler;
                }
            },

            /**
             * Create request url
             * @returns {string|String|*}
             * @private
             */
            _createUrl: function () {
                var url = this._url;
                var query = this.query;
                var urlPostfix = this._url.indexOf('?') > 0 ? '&' : '?';

                if (query) {
                    url = this._url + urlPostfix + query;
                }
                return url;
            },

            /**
             * Create request body
             * @private
             */
            _createBody: function () {
                return this._formData || this.serialize(this._data);
            },

            /**
             * Subscribe on XMLHttpRequest events
             * @private
             */
            _bindEvents: function () {
                this._bindCompleteEvents();
                this._bindProgressEvents();
                this._bindUploadEvent();
                this._bindAbortEvent();
            },

            /**
             * Subscribe on XMLHttpRequest complete events
             * @private
             */
            _bindCompleteEvents: function () {
                var handler = this._onRequestComplete.bind(this);
                this._xhr.onload = handler;
                this._xhr.onerror = handler;
            },

            /**
             * Subscribe on XMLHttpRequest progress events
             * @private
             */
            _bindProgressEvents: function () {
                this._xhr.onprogress = this._onProgress;
                this._xhr.upload.onprogress = this._onUploadProgress;
            },

            /**
             * Subscribe on XMLHttpRequest upload complete event
             * @private
             */
            _bindUploadEvent: function () {
                this._xhr.upload.onload = this._onUpload;
            },

            /**
             * Subscribe on XMLHttpRequest abort event
             * @private
             */
            _bindAbortEvent: function () {
                var self = this;
                this.xhr.onabort = function () {
                    self.aborted = true;
                    self._onRequestComplete();
                };
            },

            /**
             * Setup request timeout
             * @private
             */
            _setupTimeout: function () {
                var self = this;
                if (this._queryTimeout > 0) {
                    this._timeoutId = setTimeout(function () {
                        self.xhr.abort();
                        self.timeoutExpired = true;
                    }, this._queryTimeout);
                }
            },

            /**
             * Request open
             * @param {String} url
             * @private
             */
            _openRequest: function (url) {
                this._xhr.responseType = this._responseType;
                this._xhr.open(this._method, url, true);
                this._applyHeaders();
                this._applyCredentials();
            },

            /**
             * Setup headers
             * @private
             */
            _applyHeaders: function () {
                Object.keys(this._headers).forEach(function (header) {
                    this.xhr.setRequestHeader(header, this._headers[header]);
                }, this);
            },

            /**
             * Setup withCredentials
             * @private
             */
            _applyCredentials: function () {
                if (this._withCredentials) {
                    try {
                        this.xhr.withCredentials = true;
                    } catch (e) {}
                }
            },

            /**
             * Send request
             * @param {String|Object|Blob|FormData} body
             * @private
             */
            _sendRequest: function (body) {
                this._xhr.send(body);
            },

            /**
             * Request onComplete handler
             * @private
             */
            _onRequestComplete: function () {
                clearTimeout(this._timeoutId);
                this._callback.call(this, new Response(this));
            },

            /**
             * Get request status
             * @returns {number}
             */
            get status() {
                return this._xhr.status;
            },

            /**
             * Get response headers
             * @returns {String}
             */
            get responseHeaders() {
                return this._xhr.getAllResponseHeaders();
            },

            /**
             * Get query string
             * @returns {*|String|Object}
             */
            get query() {
                return this.serialize(this._params);
            },

            /**
             * Get http method
             * @returns {HttpMethods}
             */
            get method() {
                return this._method;
            },

            /**
             * Get Content-Type
             * @returns {ContentTypes}
             */
            get requestType() {
                return this._requestType;
            },

            /**
             * Get XMLHttpRequest
             * @returns {null|XMLHttpRequest}
             */
            get xhr() {
                return this._xhr;
            }
        };

        return Request;
    }

    module.exports = factory(
        require('./response'),
        require('./response-types'),
        require('./http-methods'),
        require('./content-types')
    );

})();
