# Documentation

## Options

The first argument of the main function is for setting the options. It takes this format (defaults shown here):

```js
server({
  port: process.env.PORT || 3000,
  public: './public',
  viewengine: 'pug',

  middle: {
    // Default middleware options here, see below
  }
});
```

## Middleware

One of the most powerful things from express and thus from `server` is the Middleware. We extended it by setting some default, useful middleware, but we wanted to also give you the flexibility to edit this.

> We recommend adding your own middleware to the folder `/middle`, and all examples below will make this assumption.

There are four ways of loading middleware with `server`: as a string, as a function, as an array or as an object. They are all explained below. The most important difference is named (object) vs unnamed (others) middleware, as only named middleware will overwrite the defaults.

### Middleware as a string

This is the simplest of them all, it will just require() that string. This is not so useful with some packages since they require an additional function call (such as `require('body-parser')()`), however it's perfect for your own middleware:

```js
// Load the middleware 'body-parser' from the folder '/middle'
server(3000, './middle/body-parser.js');
```

### Middleware as a function

Middleware *is* a function that accepts `(req, res, next)` (or `(err, req, res, next)` parameters, so all other methods are ultimatelly converted to this one. Read more just by googling' "express middleware" or "write middleware express".

As a simple example, there are many pre-packaged modules, so let's see one example where we imagine that `body-parser` is not loaded by default:

```js
// Include bodyparser in your file
let bodyparser = require('body-parser')({ extended: true });

// Load it as middleware
server(3000, bodyparser);
```

### Middleware as an array

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

### Middleware as an object

You can name them, and they will **replace one of the default middlewares if the name matches it**. Let's go with the simple example of `body-parser`:

```js
let server = require('server');

// Uses body-parser
server(3000);

// Don't use body-parser
server(3000, { bodyparser: false });

// Use a different body-parser
server(3000, { bodyparser: coolerBodyParser() });
```

This *might* break some code since it removes the original one and sets it in the current position. Let's see what this means with an example:

```js
// Imagine the default middlewares are a, b and c
server(3000, d, { b: newMiddleWare() }, e);
```

In most situations this won't change anything, but in some edge cases it *might* bring nasty bugs so a solution or alternative has to be found before 1.0.0.



## Routes

In the end of the day, routes are just a specific kind of middleware. There are many ways of including them, however we recommend these two:

### Simple router

To define a simple router, you could

```js
let server = require('server');

// Import methods 'get' and 'post' from the router
let { get, post } = server.router;

server(3000,
  get('/users', (req, res) => { /* ... */ }),
  post('/users', (req, res) => { /* ... */ })
);
```

### Complex router

If you are going to have many routes, we recommend splitting it into a separated file, either in the root of the project as `routes.js` or in a different place:

```js
// app.js
let server = require('server');
let routes = require('./routes');

server(3000, routes);
```

```js
// routes.js
let { get, post } = require('server').router;
let ctrl = require('auto-load')('controllers');

module.exports = [
  get('/', ctrl.home.index),
  get('/users', ctrl.users.index),
  post('/users', ctrl.users.add),
  get('/photos', ctrl.photos.index),
  post('/photos', ctrl.photos.add),
  ...
];
```

Note: the previous is the same as this, but we use the package `auto-load` for simplicity:

```js
let { get, post } = require('server').router;
let home = require('./controllers/home');
let users = require('./controllers/users');
let photos = require('./controllers/photos');

module.exports = [
  get('/', home.index),
  get('/users', users.index),
  post('/users', users.add),
  get('/photos', photos.index),
  post('/photos', photos.add),
  ...
];
```
