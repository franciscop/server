# Router

A router is a function that creates *route(s)*, which in turns tell the server how to handle each request. They are a specific kind of middleware that wraps your logic and acts as a gateway to it:

```js
// Plain middleware for ANY request (NOT a router)
const all = ctx => { /* ... */ };

// Create a GET route for the users page
const users = get('/users', ctx => { /* ... */ })
```

The `ctx` variable is [explained in the middleware documentation](https://serverjs.io/documentation/middleware/#context). One important difference between the routes and middleware is that [**all routes are final**](#routes-are-final). This means that **each request will use one route at most**.

All of the routers reside within the `server.router` and follow this structure:

```js
const server = require('server');
const { NAME } = server.router;
const doSomething = NAME(ID, fn1, [fn2], [fn3]);
server(doSomething);
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



### Simple router

To define a simple router, you could do:

```js
const server = require('server');

// Import methods 'get' and 'post' from the router
const { get, post } = server.router;

server(
  get('/users', ctx => { /* ... */ }),
  post('/users', ctx => { /* ... */ })
);
```



### Complex router

If you are going to have many routes, we recommend splitting it into a separated file, either in the root of the project as `routes.js` or in a different place:

```js
// app.js
const server = require('server');
const routes = require('./routes');

server(routes);
```

```js
// routes.js
const { get, post } = require('server').router;
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


## Error

> Explain about the router error: `const { error } = server.router;` and how it handles the errors thrown: `throw new Error()` || `ctx.throw('test:a')?`



## Websockets

> *Not yet available, coming in version 1.1*

```js
const server = require('server');
let { get, socket } = server.router;

server({}, [
  get('/', (req, res) => res.sendFile(__dirname + '/public/index.html')),
  socket('message', (data, socket, io) => {
    io.emit(data);
  })
]);
```


## Retrocompatibility

> Explain about the wrapper for all the middleware out there



## Routes are final

> Explain how a route is matched only once
