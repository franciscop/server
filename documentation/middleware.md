## Middleware

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
