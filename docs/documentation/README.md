# Documentation

Conceptually **server** is quite simple: you have a main function that accepts some functions, and each of those does a bit of work:

```js
const server = require('server');
server(fn1, fn2, fn3, ...);
```

The generic heavy lifting is already implemented internally **so you can focus on your project** and not in fiddling with headers and response types. These are the three big areas that are most important for using server: the [function `server()`](server), [middleware](middleware) and [router](router).

## [server()](server)

The main function. The most common usage is accepting options and middleware that do some work. Mandatory *Hello World* here:

```js
// Load the server from the dependencies
const server = require('server');

// Display "Hello 世界" in http://localhost:8080/*
server({ port: 8080 }, ctx => ctx.res.send('Hello 世界'));
```

<a class="button" href="server">server() documentation</a>



## [Middleware](middleware)

Middleware are functions that accepts a context, does some work and is resolved either synchronous or asynchronous. We just saw one in the example above:

```js
const server = require('server');

// Our middleware sends "Hello 世界" to the browser
const middleware1 = ctx => ctx.res.send('Hello 世界');

// Load the middleware and launch the server
server(middleware1);
```

<a class="button" href="middleware">Middleware documentation</a>


## [Router](router)

The last but maybe most important part is the router that you can use to create routes. Internally a route is a middleware more and you use it for handling user requests to specific places:

```js
const server = require('server');

// Import some of the routers available
const { get, post, put, del } = server.router;

// Handle requests to http://localhost:3000/
const home = get('/', ctx => ctx.res.send('Homepage'));

// Handle requests to http://localhost:3000/SOMETHING
const page = get('/:page', ctx => {
  ctx.res.send(`Showing page ${ctx.req.params.page}`);
});

server(home, page);
```

<a class="button" href="router">Router documentation</a>



## [Advanced](advanced)

Some recommendations on using and debugging server. A peak into the technology inside for understanding it better. Explanation on some of the design constrains for server.

<a class="button" href="advanced">Advanced documentation</a>
