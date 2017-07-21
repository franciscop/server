# Documentation

Conceptually **server** is a function that accepts options and other functions. The heavy lifting is already implemented **so you can focus on your project**:

```js
// Import the variable into the file
const server = require('server');

// options and fn1, fn2, etc are optional
server(options, fn1, fn2, fn3, ...);
```

First [read the **getting started** guide](/tutorials/getting-started/). The most important concepts to use server are: [**options**](options), [**middleware**](middleware) and [**router**](router). You might also want to learn by doing [**real-world examples in the tutorials**](/tutorials).


## [Options](options)

In its basic form it's a plain object with several key:values pairs:

```js
const server = require('server');

// Set the options (shown here with the defaults)
const options = {
  port: 3000,
  public: 'public',
  engine: 'pug',
  env: 'development'
};

// Launch the server with the options
server(options);
```

<a class="button" href="options"><strong>Options documentation</strong></a>


## [Middleware](middleware)

Middleware are functions that accepts a context, does some work and is resolved either synchronous or asynchronous. Mandatory *Hello World* here:

```js
// Load the server from the dependencies
const server = require('server');

// Display "Hello 世界" for any request
const middleware = ctx => 'Hello 世界';

// Launch the server with a single middleware
server(middleware);
```


<a class="button" href="middleware"><strong>Middleware documentation</strong></a>



## [Router](router)

The last but maybe most important part is the router that is used to create routes. A route is really a middleware and is used for handling user requests to specific places:

```js
const server = require('server');

// Import some of the routers available
const { get, post, put, del } = server.router;

// Handle requests to http://localhost:3000/
const home = get('/', ctx => 'Homepage!');

// Handle requests to http://localhost:3000/SOMETHING
const page = get('/:page', ctx => `Page ${ctx.req.params.page}`);

server(home, page);
```

<a class="button" href="router"><strong>Router documentation</strong></a>



## [Advanced](advanced)

Some recommendations on using and debugging server. A peak into the technology inside for understanding it better. Explanation on some of the design constrains for server.

<a class="button" href="advanced"><strong>Advanced documentation</strong></a>
