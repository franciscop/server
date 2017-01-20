## In-depth

Some extra info if you want to get into some more advanced configuration.


### Promise

The main function returns a promise which will be fulfilled when the server is launched or might throw an initialization error such as port is already in use.

It gets passed an object with these properties:

- `app`: the express instance
- `original`: the original `http-server`
- `express`: the express required as in `require('express')`

Also, it will transparently use the `http-server` whether possible (through ES6's Proxy), so function calls such as `.close()` work straight on the instance:

```js
server().then(server => {

  // Run the server for a single second then close it
  setTimeout(() => {
    server.close();
  }, 1000);
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

This is the default included middleware, which can also be seen in `src/modules`:

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


To modify the options for any of them, pass the option in the `middle` object:

```js
server({
  middle: {
    dataParser: {
      uploadDir = "public/uploads"
    }
  }
});
```

To disable any of those, pass it as a false named value in a middleware:

```js
server(3000, { dataParser: false });
```

And to use a different one, pass it as a named middleware:

```js
server(3000, { dataParser: function(req, res, next){ /* ... */ } });
```
