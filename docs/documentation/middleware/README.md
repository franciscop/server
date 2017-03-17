# Middleware

One of the most powerful things from express and thus from `server` is the Middleware. We build on this by an evolved concept while giving a wrapper for retro-compatibility:

```js
const setname = ctx => ctx.req.user = 'Francisco';
const sendname = ctx => ctx.res.send(ctx.req.user);
server(setname, get('/', sendname));
```

### Definition

A *server middleware* is a function that will be called on each request. It accepts a context object and returns a promise for asynchronous methods or anything else for synchronous methods.

### Parameters

It will only receive a parameter called `ctx` for context. This has, among others, the properties `req` `res` (from express) and `options`:

```js
let middleware = ctx => {
  ctx.req;      // Request parameter, similar to `(req, res)` in express
  ctx.res;      // Response parameter, similar to `(req, res)` in express
  ctx.options;  // The options for the server instance
}
```

Then all of the included plugins will be available here. Consult the documentation on each plugin for the specifics, but this is how they *could* be implemented:

```js
let middleware = ctx => {
  ctx.socket;  // A websocket exported from a plugin
  ctx.db;      // A database exported from a plugin
}
```

If you are developing a library or just want more advanced features, you should also have access to these:

```js
let middleware = ctx => {
  ctx.app;        // Current express instance
  ctx.server;   // The http-server instance
};
```



#### Destructuring

You can and probably should use [ES7 destructuring](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) right in the function call:

```js
let setname = ({ req }) => req.user = 'Francisco';
let sendname = ({ req, res }) => res.send(req.user);
```

All of the included plugins will also be available in this way:

```js
let middleware = ({ res, socket, db }) => {
  db.findAll({ name: 'Francisco' }).then(user => res.json(user));
}
```


### Return value

If your middleware is going to be synchronous, you can just return nothing:

```js
let middle = ({ req }) => {
  req.body = 'Hello world';
}
```

In sync mode you can throw anything to trigger an error:

```js
let middle = ({ req }) => {
  if (!req.body) {
    throw new Error('No body provided');
  }
}
server(middle).catch(err => {
  console.log("Expecting body:", err);
});
```

When you want to handle code asynchronously you should return a promise. Then it will continue the middleware chain as it is resolved, or skip it as it is rejected:

```js
let middle = ({ req }) => new Promise((resolve, reject) => {
  if (req.body) {
    resolve();
  } else {
    reject(new Error('No body provided'));
  }
});
```

Both the resolve value and the return value get ignored and the same server instance will be passed around. If you want to modify it on your middleware, do it as shown above:

```js
let addsecret = s => {
  // This will set it by reference
  s.options.secret = 'your-random-string-here';
}
let addsecret = ({ options }) => {
  // This will also set it by reference
  options.secret = 'your-random-string-here';
}
```


## Modern

Modern is a small utility that allows you to use express middleware within `server`. The proper way of using `modern` is:

```js
const server = require('server');
const { modern } = server.utils;
const oldCookieParser = require('cookie-parser')({ ... });
const cookieParser = server.modern(oldCookieParser);

server(cookieParser, ...);
```










// DEPRECATED:





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
```
