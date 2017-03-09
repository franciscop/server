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
  get('/', ctx => {}),
]);
```


## Middleware

```js
// Synchronous
let mid = ctx => ctx.req.user = { me: 'me' };

// Async
let mid = ctx => new Promise((resolve, reject) => {
  ctx.send('Hello 世界');
  resolve();
});

// Unresolved by router design
let mid = get('/', ctx => ctx.res.send('Hello 世界'));
```


## Plugins

A possible example:

```js
const myPlugin = {
  options: {
    port: Number,
    public: 'public',
    secret: String
  },
  init: [],
  before: [],
  after: [],
  launch: []
};
```
