# Documentation

This is the documentation for `server`.

To include the server, `require` it as a normal Node package:

```js
let server = require('server');
```


## Main function

`server` is a function with this signature:

```js
server(options, middleware1, middleware2, ...);
```

However, it also has a couple of handy properties:

- `server.router`: This is **not** the default router from express. Read the section [Router](#router) to see how it works.
- `server.express`: The original express server. As express is a dependency, this is the result of doing `require('express')`.


## Options

The first argument of the main function is for setting the options. It can be nothing, a single integer or a plain object:

```js
server();
server(3000);
server({ port: 3000 });  // the same
```

As you can guess, internally if it is a single integer it will be converted to the object `{ port: ARG }`. This is a handy shortcut in case you want the default options except for the port, otherwise you can specify the options (defaults shown here):

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

### `port`

This is slightly different from other options, as the variable within the environment will always overwrite this option. This is so Heroku and other servers will work nicely. So this is the inclusion order, from more important to less:

- `.env`: the variable within the environment.
- `server(3000)` || `server({ port: 3000 })`: the variable set manually when launching the server.
- `3000`: the default port if nothing else was specified.

To set the port in the environment, create a file called `.env` with this:

```
PORT=3000
```

This will allow for your server to work nicely with some hosts such as Heroku, since those provide the port as an environment variable. Don't forget then to add `.env` then to your `.gitignore`.


### `public`

The folder where your static assets are. This includes images, styles, javascript for the browser, etc. Any file that you want directly accessible through `example.com/myfile.pdf` should be in this folder.



## Middleware

One of the most powerful things from express and thus from `server` is the Middleware. We extended it by setting some default, useful middleware, but we wanted to also give you the flexibility to edit this.

> We recommend adding your own middleware to the folder `/middle`, and all examples below will make this assumption.

There are four ways of loading middleware with `server`: as a string, as a function, as an array or as an object. They are all explained below. The most important difference is named (object) vs unnamed (others) middleware, as only named middleware will overwrite the defaults.

### String

This is the simplest way to add middleware, it will just require() that string. This is not so useful with some packages since they require an additional function call (such as `require('body-parser')()`), however it's perfect for your own middleware:

> Note: this is right now broken on the alpha-1 for local packages, but expected to work on the official release

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



## Router

In the end of the day, routes are just a specific kind of middleware. There are many ways of including them, however we recommend these two:

### Simple router

To define a simple router, you could do:

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





## In-depth

Some extra info if you want to get into some more advanced configuration.


### Promise

The main function returns a promise which will be fulfilled when the server is launched or might throw an initialization error such as port is already in use. In practical terms, you can consider the parameter of the promise to be the original http-server extended with `options` with the original options, however internally it's a proxy:

```js
server().then(instance => {

  // Run the server for a single second then close it
  setTimeout(() => {
    instance.close();
  }, 1000);
}).catch(error => {
  console.log("There was an error:", error);
});
```

For most purposes you can just ignore it and launch the server ignoring the return value:

```js
server();
```

This might be useful for error-handling, debugging and testing (see the tests in `__tests__`).
