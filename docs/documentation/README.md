# Documentation

Conceptually **server** is simple: you have a main function that accepts some functions, and each of those does a bit of work:

```js
const server = require('server');
server(options, fn1, fn2, fn3, ...);
```

The generic heavy lifting is already implemented internally **so you can focus on your project** and not in fiddling with headers and response types. These are the three big areas that are most important for using server: the [function `server()`](server), [middleware](middleware) and [router](router).

> [**Subscribe here**](http://eepurl.com/cGRggH) to receive tutorials when released. Tutorials are good *for learning* while the documentation is good for reference/quick use *once you know the basics*.



## server()

The main function. The most common usage is accepting options and middleware that do some work. Mandatory *Hello World* here:

```js
// Load the server from the dependencies
const server = require('server');

// The configuration options for server()
const options = { port: 8080 };

// Display "Hello 世界" for any request
const middleware = ctx => ctx.res.send('Hello 世界');

server(options, middleware);
```

Server can be configured through options in several ways. Learn more:

<a class="button" href="options"><strong>Options documentation</strong></a>

Middleware are functions that accepts a context, does some work and is resolved either synchronous or asynchronous. We just saw one in the example above:

<a class="button" href="middleware"><strong>Middleware documentation</strong></a>



## [Router](router)

The last but maybe most important part is the router that is used to create routes. A route is really a middleware and is used for handling user requests to specific places:

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
