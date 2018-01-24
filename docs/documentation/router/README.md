# Router

Available methods and their parameters for `server.router`:

|route name                                 |example                          |
|-------------------------------------------|---------------------------------|
|[`get(PATH, FN1, FN2, ...)`](#get-)        |`get('/', ctx => { ... })`       |
|[`post(PATH, FN1, FN2, ...)`](#post-)      |`post('/', ctx => { ... })`      |
|[`put(PATH, FN1, FN2, ...)`](#put-)        |`put('/', ctx => { ... })`       |
|[`del(PATH, FN1, FN2, ...)`](#del-)        |`del('/', ctx => { ... })`       |
|[`error(NAME, FN1, FN2, ...)`](#error-)    |`error('user', ctx => { ... })`  |
|[`sub(SUBDOMAIN, FN1, FN2, ...)`](#sub-)   |`sub('es', ctx => { ... })`      |
|[`socket(NAME, FN1, FN2, ...)`](#socket-)  |`socket('/', ctx => { ... })`    |

A router is a function that tells the server how to handle each request. They are a specific kind of middleware that wraps your logic and acts as a gateway:

```js
// Import methods 'get' and 'post' from the router
const { get, post } = require('server/router');

server([
  get('/', ctx => { /* ... */ }),      // Render homepage
  get('/users', ctx => { /* ... */ }), // GET requests to /users
  post('/users', ctx => { /* ... */ }) // POST requests to /users
]);
```

The `ctx` argument is [explained in middleware's Context](/documentation/context). The router methods can be imported in several ways:

```js
// For whenever you have previously defined `server`
const { get, post } = server.router;

// For standalone files:
const { get, post } = require('server/router');
```

There are many more ways of importing the router methods, but those above are the recommended ones.



### Complex routers

If you are going to have many routes, we recommend splitting them into separated files, either in the root of the project as `routes.js` or in a different place:

```js
// app.js
const server = require('server');
const routes = require('./routes');

server(routes);
```

```js
// routes.js
const { get, post } = require('server/router');
const ctrl = require('auto-load')('controllers');

// You can simply export an array of routes
module.exports = [
  get('/', ctrl.home.index),
  get('/users', ctrl.users.index),
  post('/users', ctrl.users.add),
  get('/photos', ctrl.photos.index),
  post('/photos', ctrl.photos.add),
  ...
];
```

The `ctx` variable is [the context (documentation here)](https://serverjs.io/documentation/context). One important difference between the routes and middleware is that [**all routes are final**](#routes-are-final). This means that **each request will use one route at most**.

All of the routers reside within the `server.router` and follow this structure:

```js
const server = require('server');
const { TYPE } = server.router;
const doSomething = TYPE(ID, fn1, [fn2], [fn3]);
server(doSomething);
```



### CSRF token

For POST, PUT and DELETE requests a valid [**CSRF** token](https://github.com/expressjs/csurf) with the field name of `_csrf` must be sent as well. The local variable is set by server.js so you can include it like this:

```html
<form action="/" method="POST">
 <input name="firstname">
 <input type="submit" value="Contact us">
 <input type="hidden" name="_csrf" value="{{csrf}}">
</form>
```

If you are using an API from Javascript, such as the new `fetch()` you can handle it this way:

```html
<!-- within your main template -->
<script>
  window.csrf = '{{csrf}}';
</script>
```

```js
// Within your javascript.js/bundle.js/app.js
fetch('/', {
  method: 'POST',
  body: 'hello world',
  credentials: 'include',  // Important! to maintain the session
  headers: { 'csrf-token': csrf }  // From 'window'
}).then(...);
```


Or you could also just disable it if you know what you are doing:

```js
server({ security: { csrf: false } }, ...);
```



## get()

Handle requests of the type `GET` (loading a webpage):

```js
// Create a single route for GET /
const route = get('/', ctx => 'Hello 世界');

// Testing that it actually works
run(route).get('/').then(res => {
  expect(res.body).toBe('Hello 世界');
});
```

> Note: Read more about the [tests in code examples](/documentation/testing/#code) or just ignore them.

You can specify a query and param to be set:

```js
const route = get('/:page', ctx => {
  console.log(ctx.params.page);  // hello
  console.log(ctx.query.name);   // Francisco
  return { page: ctx.params.page, name: ctx.query.name };
});

// Test it
run(route).get('/hello?name=Francisco').then(res => {
  expect(res.body).toEqual({ page: 'hello', name: 'Francisco' });
});
```




## post()

Handle requests of the type `POST`. It needs [a csrf token](#csrf-token) to be provided:

```js
// Create a single route for POST /
const route = post('/', ctx => {
  console.log(ctx.data);
});

// Test our route. Note: csrf disabled for testing purposes
run(noCsrf, route).post('/', { body: 'Hello 世界' });
```

The [`data` property](/documentation/context/#data) can be a string or a simple object of `{name: value}` pairs.

Example:

```js
// index.js
const server = require('server');
const { get, post } = server.router;
const { file, redirect } = server.reply;

server(
  get('/', ctx => file('index.hbs')),
  post('/', ctx => {
    // Show the submitted data on the console:
    console.log(ctx.data);
    return redirect('/');
  })
);
```

```html
<!-- views/index.hbs (omitting <head>, <body>, etc) -->
<form method="POST" action="/">
  <h2>Contact us</h1>
  <label><p>Name:</p> <input type="text" name="fullname"></label>
  <label><p>Message:</p> <textarea name="message"></textarea></label>

  <input type="hidden" name="_csrf" value="{{csrf}}">
  <input type="submit" name="Contact us">
</form>
```

Example 2: JSON API. To POST with JSON you can follow this:

```js
fetch('/42', {
  method: 'PUT',
  body: JSON.stringify({ a: 'b', c: 'd' }),
  credentials: 'include', // !important for the CSRF
  headers: {
    'csrf-token': csrf,
    'Content-Type': 'application/json'
  }
}).then(res => res.json()).then(item => {
  console.log(item);
});
```



## put()

Handle requests of the type "PUT". It needs [a csrf token](#csrf-token) to be provided:

```js
// Create a single route for PUT /ID
const route = put('/:id', ctx => {
  console.log(ctx.params.id, ctx.data);
});

// Test our route. Note: csrf disabled for testing purposes
run(noCsrf, route).put('/42', { body: 'Hello 世界' });
```

The HTML `<form>` does not support `method="PUT"`, however we can overcome this by adding a special field called `_method` to the query:

```html
<form method="POST" action="/42?_method=PUT">
  ...
</form>
```

For Javascript you can just set it to `method`, for example using the new API `fetch()`:

```js
fetch('/42', {
  method: 'PUT',
  body: 'whatever',
  credentials: 'include', // !important for the CSRF
  headers: { 'csrt-token': csrf }
});
```



## del()

Handle requests of the type "DELETE". It needs [a csrf token](#csrf-token) to be provided:

```js
// Create a single route for DELETE /ID
const route = del('/:id', ctx => {
  console.log(ctx.params.id);
});

// Test our route. Note: csrf disabled for testing purposes
run(noCsrf, route).del('/42');
```

The HTML `<form>` does not support `method="DELETE"`, however we can overcome this by adding a special field called `_method` to the query:

```html
<form method="POST" action="/42?_method=DELETE">
  ...
</form>
```

For Javascript you can just set it to `method`, for example using the new API `fetch()`:

```js
fetch('/42', {
  method: 'DELETE',
  credentials: 'include', // !important for the CSRF
  headers: { 'csrt-token': csrf }
});
```



## error()

It handles an error thrown by a previous middleware:

```js
const handle = error('special', ctx => {
  console.log(ctx.error);
});

// Test it. First let's define our error in a middleware:
const throwsError = ctx => {
  const err = new Error('This is a test error');
  err.code = 'special';
  throw err;
};

// Then test it faking a request
run(throwsError, handle).get('/');
```

It accepts an optional name and then middleware. If there's no name, it will catch all of the previously thrown errors. The name will match the **beginning** of the string name, so you can split your errors by domain:

```js
// This will be caught since 'user' === 'user'
const mid1 = ctx => {
  const err = new Error('No username detected');
  err.code = 'user.noname';
  throw err;
};

// This will be caught since 'user.noname' begins by 'user'
const mid2 = ctx => {
  const err = new Error('No username detected');
  err.code = 'user.noname';
  throw err;
};

const handleUser = error('user', ctx => {
  console.log(ctx.error);
});

server(mid1, mid2, handleUser);
```



## sub()

Handle subdomain calls:

```js
const server = require('server');
const { sub } = server.router;

server([
  sub('es', ctx => {
    console.log('Call to subdomain "es"!');
  })
]);
```

It can be a string or a Regex:

```js
const language = sub(/(en|es|jp)/, ctx => {
  console.log('Wikipedia <3');
});
```



## socket()

> *Experimental now, coming stable in version 1.1*

```js
const server = require('server');
const { get, socket } = server.router;
const { render } = server.reply;

server({}, [
  get('/', ctx => render('/public/index.html')),

  // Receive a message from a single socket
  socket('message', ctx => {

    // Send the message to every socket
    io.emit('message', ctx.data);
  })
]);
```
