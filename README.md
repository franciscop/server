# Server

The simplest yet a powerful way of launching a server with Node.js:

```js
let server = require('server');

// Launch it in port 3000 to serve static files in /public
server(3000);

// Personalize the options; serve static files from the project root
server({ port: 3000, public: './' });

// Use some simple routes
let { get, post } = server.router;
server({},
  get('/', (req, res) => res.render('index')),
  post('/', (req, res) => console.log(req.body))
);
```

It parses urlencoded, json and files automatically with default middlewares while still letting you personalize the options or change those middlewares for others you prefer (or just remove them).

## Getting started

After getting Node ready and `npm init` your project, execute this from the terminal in your project folder to **install the server**:

```bash
npm install server --save
```

Then you can create a file called `app.js` and set the following:

```js
// Include the server in your file
let server = require('server');
let { get, post } = server.router;

// Initialize the server on port 3000
server(3000,

  // Handle requests to the url "/" ( http://localhost:3000/ )
  get('/', (req, res) => { res.send('Hello world!'); })
);
```

Execute this in the terminal to get the server started:

```bash
node app.js
```

And finally, open your browser on [localhost:3000](http://localhost:3000/) and you should see your server answered 'Hello world!'.


## Options


## Middleware

One of the most powerful things from express and thus from `server` is middleware. We extended it by setting some default, useful middleware, but we wanted to also give you the flexibility to edit this.

> We recommend adding your own middleware to the folder `/middle`, and all examples below will make this assumption.

There are four ways of loading middleware: as a string, as a function, as an array or as an object. They are all explained below. The most important difference is named (object) vs unnamed (others) middleware, as only named middleware will overwrite the defaults.

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

In 99% of the situations this won't change anything, but in that 1% it *will* bring nasty bugs so a solution or alternative has to be found before 1.0.0



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
let router = require('server').router;

router.get('/', (req, res) => { /* ... */ });
router.post('/', (req, res) => { /* ... */ });
// ...

module.exports = router;
```







## Goals

These are the main things that I wasn't happy with the state-of-the-art, so I decided to launch server to build upon the great work on express:

1. Make things work by default, including but not limited to:
  - Cookies
  - Session
  - Form submission
  - Including **file uploads**

2. Make things simpler to use
  - Forget about searching each package's config
  - Secure, sensible defaults
  - Easily customizable options

3. Make some important services available where possible, or some hooks to make it easier:
  - Passport
  - Database (MongoDB, etc)
  - Websockets

This will in turn **make it much easier to get started**. For me the fun is learning new libraries as I already know my way around Node and javascript, but this is overwhelming for people getting started in the ecosystem. The main frustration that I've seen from people coming from:

- Different web backgrounds (Ruby on Rails, PHP), where now they have to hunt down and compare dozens of libraries to do simple tasks.
- Different programming backgrounds (Arduino, C++) where I have to explain not only how to get a server ready with these new tools, but also how the current state of the art and the fun of it is to build your own stack.
- Starting from scratch. I pity those people starting with no programming experience coming to Node.js.
