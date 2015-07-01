http module
===========

*Every frontend developer must create own wrapper of XMLHttpRequest! (c) Unknown frontend developer*

About
-----

Are you like CommonJS?

```js
var http = require('http.1.0.0.min.js');
```

or maybe RequireJS?

```js
define(['http.1.0.0.min.js'], function(http) {
  // console.log(http);
});
```

I hope you don't want to do like that.. But you can :)

```js
window.http;
```


**GET request**

```js
var request = new http.Request();
request.get("some_url", function(response) {
    console.log(response instanceof http.Response); // true
});
```

**POST request**

Content-type header will be set to application/x-www-form-urlencoded.

```js
request.post("some url", function(response) {
    console.log(response.data)
});
```

You can create your mega requests

```js
request
    .type('json') // setup Content-type to 'application-json'
    .set('MyMegaRequestHeader', 'value')
    .params({data: 'value'}) // query params
    .data({body: 'value'}) // body data
    .noCache() // setup header 'If-Modified-Since'
    .auth('user', 'password') // setup basic authentication headers
    .timeout(5000) // waiting timeout before connection abort
    .withCredentials()
    .setUrl('my_domain.com')
    .send(function(response) {
        console.log(response)
    });
```

Callback arg is instance of Response class with some sugar.


```js
request.get('domain', function(response) {
    if (!response.ok) { //  if (response.error) { // error
        console.log(response.clientError);
        console.log(response.serverError);
        console.log(response.info);
        // i need more info!
        console.log(response.accepted);
        console.log(response.noContent);
        console.log(response.badRequest);
        console.log(response.unauthorized);
        console.log(response.notAcceptable);
        console.log(response.notFound);
        console.log(response.forbidden);
    }
});
```

Get response headers:

```js
console.log(response.headers;) // {Content-type: 'text/html', Server: 'nginx/1.2.1'}
```

Get server data:

```js
console.log(response.data) // auto parsing!
```

or

```js
console.log(response.xml);
console.log(response.json);
```

Build
-----

```
npm install
```

check code style

```js
grunt code
```

run tests

```js
grunt test
```

build module

```js
grunt test
```

all together =)

```js
grunt
```

Where it works?
---------------

It works in all modern browsers (IE9+ with window.btoa polyfill)

Your wrapper looks like superagent?
----------------------------------

Yes, I inspired by [superagent](https://github.com/visionmedia/superagent).

But I have own implementation, interface and response class.

More questions?
---------------

Feel free to [open issue](https://github.com/acvetkov/http/issues).