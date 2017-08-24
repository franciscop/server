# Documentation

Conceptually **server** is a function that accepts options and other functions. The heavy lifting is already implemented **so you can focus on your project**:

```js
// Import the variable into the file
const server = require('server');

// options and fn1, fn2, etc are optional
server(options, fn1, fn2, fn3, ...);
```

> You can also learn Node.js development by [following the tutorials](/tutorials).



## Getting started

There's [a getting started tutorial for beginners](/tutorials/getting-started/). If you know your way around:

```bash
npm install server
```

Then create some demo code in your `index.js`:

```js
// Import the library
const server = require('server');

// Launch it with a middleware that answers anything
server(ctx => 'Hello world');
```

Run it from the terminal:

```bash
node .
```

And open your browser on [localhost:3000](http://localhost:3000/) to see it in action.



## Basic usage

Some of the components are the main function on itself, [router](/documentation/router/) and [reply](/documentation/reply/). The main function accepts first an optional object for [the options](/documentation/options/), and then as many [middleware](#middleware) or arrays of middleware as wanted:

```js
const server = require('server');

server({ port: 3000 }, ctx => 'Hello 世界');
```

To use the router and reply extract their methods as needed:

```js
const server = require('server');
const { get, post } = server.router;
const { render, json } = server.reply;

server([
  get('/', ctx => render('index.hbs')),
  post('/', ctx => json(ctx.data)),
  get(ctx => status(404))
]);
```

Then when you are splitting your files into different parts and don't have access to the global server you can import only the corresponding parts:

```js
const { get, post } = require('server/router');
const { render, json } = require('server/reply');
```



## Middleware

A *middleware* is plain function that will be called on each request. It accepts [a context object](/documentation/context) and [returns a reply](/documentation/reply/), a [basic type](/documentation/reply/#return-value) or nothing. A couple of examples:

```js
const setname = ctx => { ctx.req.user = 'Francisco'; };
const sendname = ctx => send(ctx.req.user);
server(setname, sendname);
```

They can be placed as `server()` arguments, combined into an array or imported/exported from other files:

```js
server(
  ctx => send(ctx.req.user),
  [ ctx => console.log(ctx.data) ],
  require('./comments/router.js')
);
```

Then in `./comments/router.js`:

```js
const { get, post, put, del } = require('server/router');
const { json } = require('server/reply');

module.exports = [
  get('/',    ctx => { /* ... */ }),
  post('/',   ctx => { /* ... */ }),
  put('/:id', ctx => { /* ... */ }),
  del('/:id', ctx => { /* ... */ }),
];
```


The main difference between synchronous and asynchronous functions is that you use  `async` keyword to then be able to use the keyword `await` within the function, avoiding [callback hell](http://callbackhell.com/). Some examples of middleware:

```js
// Some simple logging
const mid = () => {
  console.log('Hello 世界');
};

// Asynchronous, find user with Mongoose (MongoDB)
const mid = async ctx => {
  ctx.user = await User.find({ name: 'Francisco' }).exec();
  console.log(ctx.user);
};

// Make sure that there is a user
const mid = ctx => {
  if (!ctx.user) {
    throw new Error('No user detected!');
  }
};

// Send some info to the browser
const mid = ctx => {
  return `Some info for ${ctx.user.name}`;
};
```

In this way you can `await` inside of your function. Server.js will also await to your middleware before proceeding to the next one:

```js
server(async ctx => {
  await someAsyncOperation();
  console.log('I am first');
}, ctx => {
  console.log('I am second');
});
```

If you find an error in an async function you can throw it. It will be catched, a 500 error will be displayed to the user and the error will be logged:

```js
const middle = async ctx => {
  if (!ctx.user) {
    throw new Error('No user :(');
  }
};
```

<blockquote class="warning">**Avoid callback-based functions**: error propagations is problematic and they have to be converted to promises. Strongly prefer an async/await workflow.</blockquote>



### Express library

Server.js is using express as the underlying library (we <3 express!). You can import middleware designed for express with `modern` is a small utility tool:

```js
const server = require('server');
const { modern } = server.utils;
const legacy = require('legacy-package')({ ... });
const mid = modern(legacy);

server(mid);
```
