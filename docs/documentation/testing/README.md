# Testing

<blockquote class="error">
  If you happen to stumble here, this bit of the documentation is outdated and follows some old code. Please help us improve the project and the docs so we can make it into the official release.
</blockquote>

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
const run = require('server/test/run');
const needuser = require('./needuser');

describe('auth/needuser.js', () => {
  it('returns a server error without a user', async () => {
    const res = await run(needuser).get('/');
    expect(res.status).toBe(403);
  });

  it('works with a mocked user', async () => {
    const mockuser = ctx => { ctx.user = {}; };
    const res = await run(mockuser, needuser).get('/');
    expect(res.status).toBe(200);
  });
});
```

## run()

This function accepts the same arguments as `server()`, however it will return an API that you can use to test any middleware (and, by extension, any route) that you want. The API that it returns so far is this:

```js
const run = require('server/test/run');

const api = run(TOTEST);

api.get.then(res => { ... });
api.post.then(res => { ... });
api.put.then(res => { ... });
api.del.then(res => { ... });
```

## Disable CSRF

For testing POST, PUT and DELETE methods you might want to disable CSRF. To do that, just pass it the appropriate option:

```js
run({ security: { csrf: false } }, TOTEST);
```

This API accepts as arguments:

```js
api.get(URL, OPTIONS);
```

It is using [`request`](https://github.com/request/request) underneath, so the options are the same as for this module. There are few small differences:

- It will generate the port randomly from [1024](https://stackoverflow.com/q/413807/938236) to [49151](https://stackoverflow.com/a/113237/938236). However, there is a chance of collision that grows [faster than expected](https://en.wikipedia.org/wiki/Birthday_problem) as your number of tests grows. There's mitigation code going on to avoid collisions so until the tens of thousands of tests it should be fine.
- The URLs will be made local internally to `http://localhost:${port}` unless you fully qualify them (which is not recommended).
