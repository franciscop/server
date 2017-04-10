# Advanced

Some of the concepts that you won't find day-to-day but that might be useful when debugging, creating your own libraries or contributing to server.



## Creating middleware

While *plugins are not yet available* you can create middleware just fine and it should be able to cover most developer needs.


## Join routes

If you have two routers and want to make it into one for any reason, you can do so through a helper function we created.

```js
let { get, post, join } = server.router;

let routes = join(
  get('/', home.index),
  get('/users', users.index),
  // ...
);

server({}, acceptsOnlyASingleRoute(routes));
```


<!--
## Experimental

> To enable these, you'll have to add an `EXPERIMENTAL=1` to your environment variables. No need to say that this is not stable and not part of the stable API.

There's an experimental way of dealing with those:

```js
server([
  get('/about.html').file('public/about.html'),
  get('/non-existing').status(404).send('Error 404!'),
  get('/').send('Hello 世界')
]);
```

They are the same methods as in [Express Methods](http://expressjs.com/en/api.html#res.methods) and accept the same parameters (adding `file`, which is an alias of `sendFile`, and removing `get` and `set` as it conflicts with `Router.get` and `Router.set`). The ones that *do not send* a response can be concatenated, while the ones that send a response will be ignored. So the second *send* will be ignored:

```js
server([
  get('/').status(200).send('Hi there').send('I am ignored')
]);
```
-->



## Promise

The main function returns a promise which will be fulfilled when the server is launched or might throw an initialization error such as port is already in use.

It gets passed the `ctx` object, just without the request-specific parameters (not including `req` and `res` among others). It does include:

- `app`: the express instance
- `server`: the original `http-server`
- `express`: the express required as in `require('express')`

Also, it will transparently use the `http-server` whether possible (through ES6's Proxy), so function calls such as `.close()` work straight on the instance:

```js
server().then(ctx => {

  // Run the server for a single second then close it
  setTimeout(() => ctx.close(), 1000);
}).catch(error => {
  console.log("There was an error:", error);
});
```

For most purposes you can just launch the server ignoring the return value:

```js
server();
```

This might be useful for error-handling, debugging and testing (see the tests in the folder `tests`) or extending server's functionality.


### Included modules

This is the default included middleware, which can also be seen in `plugins/parse` and `plugins/connect`:

- [`dotenv`](https://www.npmjs.com/package/dotenv)
- `bodyParser` : [`body-parser`](https://www.npmjs.com/package/body-parser)
- `jsonParser` : [`body-parser`](https://www.npmjs.com/package/body-parser)
- `dataParser` : [`express-data-parser`](https://www.npmjs.com/package/express-data-parser)
- `compress` : [`compression`](https://www.npmjs.com/package/compression)
- `cookieParser` : [`cookie-parser`](https://www.npmjs.com/package/cookie-parser)
- `session` : [`express-session`](https://www.npmjs.com/package/express-session)
- `favicon` : [`serve-favicon`](https://www.npmjs.com/package/serve-favicon)
- `responseTime` : [`response-time`](https://www.npmjs.com/package/response-time)
- `methodOverride` : [`method-override`](https://www.npmjs.com/package/method-override)
