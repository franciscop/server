# Session in production

Sessions work out of the box for developing, but they need a bit of extra work to be ready for production.

## Secret

The first thing to change is adding a [session secret](https://martinfowler.com/articles/session-secret.html) as an [environment variable](/documentation/options/#environment) in `.env` for your machine:

```
SECRET=your-random-string-here
```

This will be used to secure the cookies as well as for other plugins that need a secret. Make it unique, long and random. Then **don't forget to add a different one for the production server** and other stages in your deploy pipeline if any. Also, exclude the `.env` file from Git [as explained here](http://localhost:3000/documentation/options/#environment).


## Storage

**By default** [sessions work in-memory with *server*](https://github.com/expressjs/session) so they are [**not ready for production**](https://github.com/expressjs/session/pull/220):

```js
// Simple visit counter for the main page
const counter = get('/', ctx => {
  ctx.session.views = (ctx.session.views || 0) + 1;
  return { views: ctx.session.views };
});

/* test */
await run(counter).alive(async api => {
  let res = await api.get('/');
  expect(res.body.views).toBe(1);
  res = await api.get('/');
  expect(res.body.views).toBe(2);
  res = await api.get('/');
  expect(res.body.views).toBe(3);
});
```

This works great for testing; for quick demos and for short sessions, but **all session data will die when the server is restarted** since they are stored in the RAM.

To make them persistent we recommend [using a compatible session storage](https://github.com/expressjs/session#compatible-session-stores). We bundle Redis for Node.js by default, so you just have to install it (\*nix systems have it easily available). For example, on Ubuntu:

```
sudo apt install redis-server
```

Then edit your `.env` to include `REDIS_URL`:

```
SECRET=your-random-string-here
REDIS_URL=redis://:password@hostname:port/db_number
```

> Note: for Heroku this variable is created automatically when adding [the appropriate add-on](https://devcenter.heroku.com/articles/heroku-redis). For other hosting companies please consult their documentation.

Otherwise add your preferred storage to the session through the options:

```js
const server = require('server');
// Your own file for the config:
const storage = require('./session-storage.js');
server({ session: { storage } }, [
  // Routes here
]);
```

If you need to use express' session, as some libraries might require you to do, you can access it through `server.session`:

```js
const server = require('server');

// Mount it on express' session
const MongoStore = require('connect-mongo')(server.session);
const store = MongoStore(options);

server(
  { session: { store } }
  ...
);
```


### Alternatives

Why not just use cookie-session? [Here is an explanation of the alternative](http://stackoverflow.com/a/15745086/938236), but it boils down to:

- They are more insecure, since all the session data (including sensitive data) is passed forward and backward from the browser to the server in each request.
- If the session data is large then that means adding an unnecessary load to both the server and the browser.
