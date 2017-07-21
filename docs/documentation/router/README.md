# Router

Available methods and their parameters for `server.router`:

|route name                               |example                               |
|-----------------------------------------|--------------------------------------|
|[`get(PATH, FN1, FN2, ...)`](#get-)      |`get('/', ctx => { ... })`            |
|[`post(PATH, FN1, FN2, ...)`](#post-)    |`post('/', ctx => { ... })`           |
|[`put(PATH, FN1, FN2, ...)`](#put-)      |`put('/', ctx => { ... })`            |
|[`del(PATH, FN1, FN2, ...)`](#del-)      |`del('/', ctx => { ... })`            |
|[`error(NAME, FN1, FN2, ...)`](#error-)  |`error('NotSoSecret', ctx => { ... })`|
|[`socket(NAME, FN1, FN2, ...)`](#socket-)|`socket('/', ctx => { ... })`         |
|[`sub(SUBDOMAIN, FN1, FN2, ...)`](#sub-) |`sub('es', ctx => { ... })`           |

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

The `ctx` argument is [explained in middleware's Context](../middleware/#context). The router methods can be imported in several ways:

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

The `ctx` variable is [explained in the middleware documentation](https://serverjs.io/documentation/middleware/#context). One important difference between the routes and middleware is that [**all routes are final**](#routes-are-final). This means that **each request will use one route at most**.

All of the routers reside within the `server.router` and follow this structure:

```js
const server = require('server');
const { TYPE } = server.router;
const doSomething = TYPE(ID, fn1, [fn2], [fn3]);
server(doSomething);
```



### CSRF token

For POST, PUT and DELETE requests a valid [**CSRF** token](https://github.com/expressjs/csurf) with the field name of `_csrf` must be sent as well. The local variable is set by server.js so there's no need to generate it manually:

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

Handle requests of the type `GET`:

```js
// Create a single route for GET /
const route = get('/', ctx => 'Hello 世界');

// Testing that it actually works (see /testing/code )
run(route).get('/').then(res => {
  expect(res.body).toBe('Hello 世界');
});
```

You can specify a query and param to be set:

```js
const route = get('/:page', ctx => {
  expect(ctx.params.page).toBe('hello');
  expect(ctx.query.name).toBe('Francisco');
  return 200;
});

// Test it
run(route).get('/hello?name=Francisco').then(res => {
  expect(res.statusCode).toBe(200);
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

The [`data` property](/documentation/middleware/#data) can be a string or a simple object of `{name: value}` pairs.

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








## REST

The [basic REST routers](http://stackoverflow.com/q/671118/938236) are present: `get`, `post`, `put`, `del`. Delete is called `del` since 'delete' is a reserved word in Javascript. This is the recommended way of importing the routers with destructuring:

```js
const server = require('server');
const { get, post, put, del } = server.router;
```

> TODO: split this into a tutorial as I couldn't find any decent one for this:

They all [accept a path in a similar way to Express.js](http://expressjs.com/en/4x/api.html#router) as ID, which will be parametrized:

```js
const server = require('server');
const { get } = server.router;

// Homepage
get('/', ctx => { /* ... */ });

// A specific page
get('/users', ctx => { /* ... */ });

// Any page such as /contact, /users, /125, etc
get('/:page', ctx => { /* ... */ });
```


## Error

It handles previously thrown errors:

```js
server(
  ctx => { throw new Error('Whatever'); },
  error(ctx => {
    // ...
  })
);
```

> TODO: Explain about the router error: `const { error } = server.router;` and how it handles the errors thrown: `throw new Error()` || `ctx.throw('test:a')?`



## Websockets

> *Experimental now, coming stable in version 1.1*

```js
const server = require('server');
const { get, socket } = server.router;

server({}, [
  get('/', (req, res) => res.sendFile(__dirname + '/public/index.html')),
  socket('message', (data, socket, io) => {
    io.emit(data);
  })
]);
```

> TODO: add a lot of information



## Subdomain

Handle a subdomain call:

```js
const server = require('server');
const { sub } = server.router;

server([
  sub('es', ctx => {
    console.log('Call to subdomain!');
  })
]);
```



## Retrocompatibility

> Explain about the wrapper for all the middleware out there



## Routes are final

> Explain how a route is matched only once
