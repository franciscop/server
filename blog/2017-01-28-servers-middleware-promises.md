---
title: Server’s middleware ♥ Promises
description: This is the journey of creating a simple and powerful server for Node.js.
date: 2017-01-28
tag: Blog
---

This is the journey of creating [a simple and powerful server for Node.js](https://github.com/franciscop/server).

I decided to step back and [change the way middleware works](https://github.com/franciscop/server/issues/1) before committing to 1.0.0. It hasn’t been easy, however I think that we can achieve a lot more with ES6+ than with Connect’s middleware and Koa’s middleware is way too complex for Server’s purpose.

## Definition

I decided to [create a new standard](https://xkcd.com/927/) for Server’s middleware:

**Synchronous**: just a function that gets the context and returns anything.

```js
// Parse the body from the request
const bodyParser = ctx => {
  ctx.req.body = parsebody(ctx.req);
};
```

**Asynchronous**: a function that gets the context and returns a promise that will be resolved (or rejected) when the processing finishes.

```js
// Using a Promise-aware library, more and more everyday
const auth = ctx => findUser(ctx.req.session.id).then(user => {
  ctx.req.user = user;
});
```

```js
// Porting an existing callback-based library
const ported = ctx => new Promise((resolve, reject) => {
  doSomethingAsync({}, (err, cb) => {
    if (err) reject(err);
    resolve(cb);
  });
});
```

This was a “what would the best way for creating middleware with ES6 from scratch?” kind of idea. I still needed to check if this makes sense at all.

## Joining middleware

For testing I made a function that joins them. I got [bitten with express](https://github.com/expressjs/express/issues/3148) when I tried to do the same (100% my fault for not learning how it worked better) but I was surprised at how easy it was when using promises.

The objective of _join_ is that this code works as expected:

```js
// my-custom-middleware.js
const join = require('./join');
```

```js
const parseBody = ctx => {
  ctx.req.body = bodyparser(ctx.req);
};
```

```js
const auth = ctx => findUser(ctx.req.session.user).then(user => {
  ctx.req.user = user;
});
```

```js
// Return a single middleware that chains them
module.exports = join(parseBody, auth);
```

This join can be defined with just native code:

```js
// join.js
// Pass a group of middleware and return a single one
module.exports = (...mid) => ctx => mid.reduce((prev, next) => {
```

```js
  // Pass always the original context; not the returned one
  return prev.then(next).then(fake => ctx);
```

```js
// Get it started with the right context
}, Promise.resolve(ctx));
```

> _We should totally do_ _loadware(mid).reduce... with_ [loadware](https://www.npmjs.com/package/loadware) _to flatten the array, but I didn't want to add this dependency for the example._

That’s it. Now you get a single middleware from those two by just using native code and Promise-aware middleware.

## Compatibility with Express/Connect

I also made a function to make any of the original express middleware work with server (making it promise-aware). It is quite easy to use:

```js
// compress.js
const compress = require('compression')({ /* opts */ });
const modern = require('./modern');
```

```js
module.exports = modern(compress);
```

To allow for dynamic options is slightly more complex:

```js
// body-parser.js
const compress = require('compression');
const modern = require('./modern');
```

```js
module.exports = ctx => {
  const middleware = compress(ctx.options.compress);
  return modern(middleware)(ctx);
};
```

## Problems

The main problem is that a promise chain cannot be stopped in a non-error way so it’s not possible to easily halt the call even when a router has successfully been called.

We are _mostly_ ignoring the return value and I think promises require to be resolved or rejected to avoid memory leaks, so leaving an unsolved promise also doesn’t help.

This leads to **the first constrain**:

**All the routers will be final; only the first router that matches a path will be used and the rest are ignored:**

```js
server(
  get('/', ctx => { /* called  */ }),
  get('/', ctx => { /* ignored */ }),
  get('/', ctx => { /* ignored */ }),
);
```

The second but also important problem is handling errors. All of the middleware accepts a single parameter, _ctx_, so it cannot be analyzed to see which one is supposed to handle errors.

This leads to **the second constrain**:

**Only throw to the middleware chain when there is a truly catastrophic global issue; try to resolve the local issues within your middleware:**

```js
server(
  ctx => {
    // Recoverable error
    // NO: throw new Error('No nnn active. Halt it all!');
    // Yes:
    ctx.log('No nnn active. To use it make sure ...');
  },
);
```

## Conclusion

This is still alpha software, but so far every indication is that we can transition to an awesome Promise-aware world while easily bringing all of the ES5-world code. [See more about the project in Github](https://github.com/franciscop/server).

![](https://medium.com/_/stat?event=post.clientViewed&referrerSource=full_rss&postId=41d82a184452)

---

[Server’s middleware ♥ Promises](https://medium.com/server-for-node-js/servers-middleware-promises-41d82a184452) was originally published in [Server for Node.js](https://medium.com/server-for-node-js) on Medium, where people are continuing the conversation by highlighting and responding to this story.

---

_Originally published on [Medium](https://medium.com/server-for-node-js/servers-middleware-promises-41d82a184452)._
