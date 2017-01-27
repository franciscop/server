# Specification

A small specification

## Main function

```js
server(options, middleware) => promise
```


## Options

Environment > parameter > default

Parameter = string || number || bool

```js
let port = process.env.PORT || options.port || 3000;
```


## Router

```js
let server = require('server');
let { get, post } = server.router;

server([
  get('/', ),
]);
```


## Middleware

```js
// Synchronous
let mid = ctx => ctx.req.user = { me: 'me' };

// Async purposefully unresolved
let mid = ctx => new Promise((resolve, reject) => {
  ctx.send('Hello 世界');
});

// Unresolved by router design
let mid = get('/', ctx => ctx.res.send('Hello 世界'));
```


## Plugins
