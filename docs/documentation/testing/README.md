# Testing

<blockquote class="error">
  If you happen to stumble here, this bit of the documentation is outdated and follows some old code. Please help us improve the project and the docs so we can make it into the official release.
</blockquote>

> To create tests with server/test, make sure you read the section Closing the Server.

There is an advanced test suite included which is used internally to test server.js extensively:

```js
// index.test.js
const server = require('server');
const test = require('server/test');

const app = server(() => 'Hello world');

describe('a simple website', () => {
  it('says hello world', async () => {
    const res = await test(app).get('/');
    expect(res.body).toBe('Hello world');
  });
});
```

But this proof of concept is not good enough, since we are launching and testing our server from the same file. In the real world, we want to be able to test it independently so we'll do:

```js
// index.js - our main file where the server is launch
const server = require('server');

// Same as always, just export it with `module.exports =`
module.exports = server(() => 'Hello world');
```

Then for our testing we do:

```js
// index.test.js - our main testing file
const app = require('./');
const test = require('server/test');

describe('a simple website', () => {
  it('says hello world', async () => {
    const res = await test(app).get('/');
    expect(res.body).toBe('Hello world');
  });
});
```

That way we can either launch it or test it from the console with these two commands:

```bash
node index.js
jest --coverage --forceExit
```

We can write those on our `package.json` so we don't even have to remember them:

```js
  "scripts": {
    "start": "node index.js",
    "test": "jest --coverage --forceExit"
  }
```

Then we can start it and test it with `npm start` and `npm test` respectively.




## Close the server

There are two ways of running tests. We can let `server/test` launch its own server on each tests, so it'll clean after itself, or we can provide a global server instance to it but then we are responsible to clean up after ourselves. This mimics nicely the expected situations for unit/integration testing respectively.

### Auto closing

For these, you provide a middleware or some options and `test()` will automatically launch a server with these and close them:

```js
/* test */
const test = require('server/test');

// The middleware function that we want to test
// in this example, find a user in the list
const validTokens = ['t353459821389', 't547432523454', 't564352424223'];
const mid = ctx => {
  if (validTokens.includes(ctx.query.token)) {
    return 'Valid!';
  }
  return 'Invalid :(';
};

describe('auth', () => {
  it('correctly handles admin or user emails', async () => {
    const validRes = await test(mid).get('/?token=t353459821389');
    expect(validRes.body).toBe('Valid!');

    const invalidRes = await test(mid).get('/?token=madeuptoken');
    expect(invalidRes.body).toBe('Invalid :(');
  });
});
```


### Manual closing

However if you start the server in a separate file like `index.js` and want to test that, you'd normally export it like this:

```js
// index.js
const server = require('server');

module.exports = server(() => 'Hello world');
```

Then you import it from your testing file and test that:

```js
// index.test.js
const app = require('./index');

describe('auth', () => {
  it('correctly handles admin or user emails', async () => {
    const res = await test(app).get('/');
    expect(res.body).toBe('Hello world');
  });
});
```

But in this situation test() will **not** close the session, so any further test will reuse the same instance. This is great for integration testing! But not so good for unit testing or when you want to restart things from scratch.

```json
{
  ...
  "globalTeardown": "./close.js"
}
```




## Unit testing

With a unit testing you want to see a small portion of











> OLD DOCS BELOW! PLEASE IGNORE THEM

> OLD DOCS BELOW! PLEASE IGNORE THEM

> OLD DOCS BELOW! PLEASE IGNORE THEM

> OLD DOCS BELOW! PLEASE IGNORE THEM

There's a small test suite included, but you probably want to use something more specific to your use-case.

Testing that a middleware correctly handles the lack of a user:

```js
// auth/errors.js (more info in /documentation/errors/)
const error = require('server/error');
error['/app/auth/nouser'] = 'You must be authenticated to do this';
module.exports = error;
```

Our main module:

```js
// auth/needuser.js
const AuthError = require('./errors');

module.exports = ctx => {
  if (!ctx.user) {
    throw new AuthError('/app/auth/nouser', { status: 403, public: true });
  }
};
```

Then to test this module:

```js
// auth/needuser.test.js
const test = require('server/test');
const needuser = require('./needuser');

describe('auth/needuser.js', () => {
  it('returns a server error without a user', async () => {
    const res = await test(needuser).get('/');
    expect(res.status).toBe(403);
  });

  it('works with a mocked user', async () => {
    const mockuser = ctx => { ctx.user = {}; };
    const res = await test(mockuser, needuser).get('/');
    expect(res.status).toBe(200);
  });
});
```

## test()

This function accepts the same arguments as `server()`, however it will return an API that you can use to test any middleware (and, by extension, any route) that you want. The API that it returns so far is this:

```js
const test = require('server/test');

const api = test(TOTEST).get('/');
```

## Disable CSRF

For testing POST, PUT and DELETE methods you might want to disable CSRF. To do that, just pass it the appropriate option:

```js
test({ security: { csrf: false } }, TOTEST);
```

This API accepts as arguments:

```js
api.get(URL, OPTIONS);
```

It is using [`request`](https://github.com/request/request) underneath, so the options are the same as for this module. There are few small differences:

- It will generate the port randomly from [1024](https://stackoverflow.com/q/413807/938236) to [49151](https://stackoverflow.com/a/113237/938236). However, there is a chance of collision that grows [faster than expected](https://en.wikipedia.org/wiki/Birthday_problem) as your number of tests grows. There's mitigation code going on to avoid collisions so until the tens of thousands of tests it should be fine.
- The URLs will be made local internally to `http://localhost:${port}` unless you fully qualify them (which is not recommended).
