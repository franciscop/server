# Documentation

To include server, `require` it as a normal Node package:

```js
const server = require('server');
```

## Main function

`server` is a function with this signature:

```js
server(options, middleware1, middleware2, ...);
```

- [Options](options.md) [optional]: an object with the options. [Read more...](options.md).
- [Middleware](middleware.md) [optional]: the middleware that handles requests [Read more...](middleware.md).

However, it also has the handy property:

- `server.router`: Read the section [Router](router.md) to see how it works. This is **not** the default router from express.
