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

Context is the **only parameter that middleware receives** and we'll call it `ctx`. **It represents all the information known at this point**. It can appear at several points, but the most important one is as a middleware parameter.

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


> TODO: explain more about `req`, `res` and `options` (explanation for each and their methods and a link to express docs). Explain that ctx is where to store data.



## Synchronous

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


## Asynchronous

While code is synchronous by default, we highly recommend just setting your code to asynchronous. To do this, add the keyword `async` before the middleware function:

```js
// Asynchronous, find user with Mongoose (MongoDB)
const middle = async ctx => {
  const user = await user.find({ name: 'Francisco' }).exec();
  console.log(user);
};
```

If you find an error in an async function you can throw it. It will be catched and a 500 error will be displayed to the user:

```js
const middle = async ctx => {
  if (!ctx.user) {
    throw new Error('No user :(');
  }
};
```

Please **try to avoid** using callback-based functions, since error propagations is problematic.

> TODO: explain how callbacks should be converted



## Return value

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

> TODO: explain about `reply`.



## Express middleware

Modern is a small utility that allows you to use express middleware within `server`. The proper way of using `modern` is:

```js
const server = require('server');
const { modern } = server.utils;
const oldCookieParser = require('cookie-parser')({ ... });
const cookieParser = server.modern(oldCookieParser);

// TODO: cancel the old cookieparser
server(cookieParser, ...);
```

> TODO: add more examples, clear things up
