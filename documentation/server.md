# Documentation

This is the documentation for `server`.

To include server, `require` it as a normal Node package:

```js
const server = require('server');
```

## Main function

`server` is a function with this signature:

```js
server(options, middleware1, middleware2, ...);
```

However, it also has the handy property:

- `server.router`: Read the section [Router](#router) to see how it works. This is **not** the default router from express.
