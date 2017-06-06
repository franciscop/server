# Middleware

A *server middleware* is a function that will be called on each request. It accepts [a context object](#context) and [returns a promise](#asynchronous-return) for asynchronous methods or [something else](#synchronous-return) for synchronous methods. A couple of examples:

```js
const setname = ctx => { ctx.req.user = 'Francisco'; };
const sendname = ctx => ctx.req.user;
server(setname, sendname);
```

We are using the latest version of Javascript (ES7) that provides many useful options.

> Note: if you resolve it with a function, this will be called with `ctx`. This is not so useful for normal devs, but it is for server contributions. See [advanced configuration](../advanced/).




## Context

Context is the only parameter that middleware receives and we'll call it `ctx`. **It represents all the information known at this point**. It can appear at several points, but the most important one is as a middleware parameter.

In this situation it has, among others, the properties `req`, `res` (from express) and `options`:

```js
const middleware = ctx => {
  ctx.req;      // Request parameter, similar to `(req, res)` in express
  ctx.res;      // Response parameter, similar to `(req, res)` in express
  ctx.options;  // The options for the server instance
}
```

If you are developing a library or just want more advanced features, you should also have access to these:

```js
let middleware = ctx => {
  ctx.app;        // Current express instance
  ctx.server;     // The http-server instance
};
```


TODO: explain more about `req`, `res` and `options` (explanation for each and their methods and a link to express docs).



## Synchronous return

A synchronous function is one that executes one line after another. To make your function synchronous you just have [not to make it asynchronous](#asynchronous-return), which means *do not return a promise*.

Most code is actually synchronous so let's see some examples:

```js
// Some simple logging
const middle1 = () => {
  console.log('Hello 世界');
};

// Asign a user to the context
const middle2 = ctx => {
  ctx.user = { name: 'Francisco', available: true };
};

// Make sure that there is a user
const middle3 = ctx => {
  if (!ctx.user) {
    throw new Error('No user detected!');
  }
};

// Send some info to the browser
const middle4 = ctx => {
  return `Some info for ${ctx.user.name}`;
};
```


## Asynchronous return


```js
// Asynchronous, find user with Mongoose (MongoDB)
const middle2 = async () => {
  const user = await user.find({ name: 'Francisco' }).exec();
  console.log(user);
};
```

And how to use them:

```js
// Synchronous
server(() => {
  console.log('Hello 世界');
});

// Asynchronous
server(async () => {
  const user = await user.find({ name: 'Francisco' }).exec();
  console.log(user);
});
```



### Return value

If your middleware is going to be synchronous, you can just return the value to be sent to the browser:

```js
// Send a string
const middle = ctx => 'Hello 世界';

// Send a JSON
const middle = ctx => ['hello', '世界'];
const middle = ctx => ({ hello: '世界' });
// Note: extra parenthesis not to be confused with arrow fn

// Send a status code
const middle = ctx => 404;
```

In sync mode you can throw anything to trigger an error:

```js
const { error } = server.router;

let middle = ({ req }) => {
  if (!req.body) {
    throw new Error('No body provided');
  }
}

server(middle, error(ctx => {
  console.log(ctx.error);
}));
```

When you want to handle code asynchronously you should return a promise. Then it will continue the middleware chain as it is resolved, or skip it as it is rejected:

```js
const middle = async ctx => {
  if (!req.body) {
    throw new Error('No body provided');
  }
});
```



## Modern

Modern is a small utility that allows you to use express middleware within `server`. The proper way of using `modern` is:

```js
const server = require('server');
const { modern } = server.utils;
const oldCookieParser = require('cookie-parser')({ ... });
const cookieParser = server.modern(oldCookieParser);

// TODO: cancel the old cookieparser
server(cookieParser, ...);
```










<!-- // DEPRECATED:





One of the most powerful things from express and thus from `server` is the Middleware. We extended it by setting some default, useful middleware, but we wanted to also give you the flexibility to edit this.

> We recommend adding your own middleware to a folder in your project called `/middle`, and all examples below will make this assumption.

There are four ways of loading middleware with `server`: as a string, as a function, as an array or as an object. They are all explained below. The most important difference is named (object) vs unnamed (others) middleware, as only named middleware will overwrite the defaults.

### String

This is the simplest way to add middleware, it will just require() that string. This is not so useful with some packages since they require an additional function call (such as `require('body-parser')()`), however it's perfect for your own middleware:

```js
// Load the middleware 'body-parser' from the folder '/middle'
server(3000, './middle/body-parser.js');
```

Then inside that `./middle/body-parser.js`:

```js
module.exports = function(req, res, next) {

  // do your thing here

  next();
}
```

### Function

Middleware *is* a function that accepts `(req, res, next)` (or `(err, req, res, next)` parameters, so all other methods are ultimately converted to this one. Read more just by googling' "express middleware" or "write middleware express".

As a simple example, there are many pre-packaged modules, so let's see one example where we imagine that `body-parser` is not loaded by default:

```js
// Include bodyparser in your file
let bodyparser = require('body-parser')({ extended: true });

// Load it as middleware
server(3000, bodyparser);
```

### Array

This will be converted to a series of functions, and inside the array there can be any of the other types. It is useful to bundle them by category:

```js
let parsers = [
  // ...
];

let { get, post } = server.router;
let routes = [
  get('/', (req, res) => { /* ... */ }),
  post('/', (req, res) => { /* ... */ })
];

server(3000, parsers, routes);
```

### Object

You can name them, and they will **replace one of the default middlewares if the name matches it**. Let's go with the simple example of `body-parser`:

```js
const server = require('server');

// Uses body-parser
server(3000);

// Don't use body-parser
server(3000, { bodyparser: false });

// Use a different body-parser
server(3000, { bodyparser: coolerBodyParser() });
``` -->
