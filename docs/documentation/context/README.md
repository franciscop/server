# Context

Context is the **only** parameter that middleware receives and contains all the information available at this point of the request:


|name                  |example                                       |type    |
|----------------------|----------------------------------------------|--------|
|[.options](#-options) | `{ port: 3000, public: 'public' }`           |Object  |
|[.data](#-data)       | `{ firstName: 'Francisco '}`                 |Object  |
|[.params](#-params)   | `{ id: 42 }`                                 |Object  |
|[.query](#-query)     | `{ search: '42' }`                           |Object  |
|[.session](#-session) | `{ user: { firstName: 'Francisco' } }`       |Object  |
|[.headers](#-headers) | `{ 'Content-Type': 'application/json' }`     |Object  |
|[.cookie](#-cookie)   | `{ acceptCookieLaw: true }`                  |Object  |
|[.files](#-files)     | `{ profilepic: { ... } }`                    |Object  |
|[.ip](#-ip)           | `'192.168.1.1'`                              |String  |
|[.url](#-url)         | `'/cats/?type=cute'`                         |String  |
|[.method](#-method)   | `'GET'`                                      |String  |
|[.path](#-path)       | `'/cats/'`                                   |String  |
|[.secure](#-secure)   | `true`                                       |Boolean |
|[.xhr](#-xhr)         | `false`                                      |Boolean |

It can appear at several points, but the most important one is as a middleware parameter:

```js
// Load the server from the dependencies
const server = require('server');

// Display "Hello 世界" for any request
const middleware = ctx => {
  // ... (ctx is available here)
  return 'Hello 世界';
};

// Launch the server with a single middleware
server(middleware);
```



## .options

An object containing [all of the parsed options](/documentation/options/) used by server.js. It combines environment variables and explicit options from `server({ a: 'b' });`:

```js
const mid = ctx => {
  expect(ctx.options.port).toBe(3012);
};

// Test it
run({ port: 3012 }, mid).get('/');
```

If we have a variable set in the `.env` or through some other environment variables, it'll use that instead as [environment options take preference](/documentation/options/):

```bash
# .env
PORT=80
```

```js
const mid = ctx => {
  expect(ctx.options.port).toBe(80);
};

// Test it
run({ port: 3000 }, mid).get('/');
```




## .data

This is aliased as `body` as in other libraries. It is the data sent with the request. It can be part of a POST or PUT request, but it can also be set by others such as websockets:

```js
const middle = ctx => {
  expect(ctx.data).toBe('Hello 世界');
};

// Test it (csrf set to false for testing purposes)
run(noCsrf, middle).post('/', { body: 'Hello 世界' });
run(middle).emit('message', 'Hello 世界');
```



## .params

Parameters from the URL as specified [in the route](/documentation/router/):

```js
const mid = get('/:type/:id', ctx => {
  expect(ctx.params.type).toBe('dog');
  expect(ctx.params.id).toBe('42');
});

// Test it
run(mid).get('/dog/42');
```

They come from parsing [the `ctx.path`](#-path) with the [package `path-to-regexp`](https://www.npmjs.com/package/path-to-regexp). Go there to see more information about it.



## .query

The parameters from the query when making a request. These come from the url fragment `?answer=42&...`:

```js
const mid = ctx => {
  expect(ctx.query.answer).toBe('42');
  expect(ctx.query.name).toBe('Francisco');
};

// Test it
run(mid).get('/question?answer=42&name=Francisco');
```



## .session





## .headers





## .cookie





## .files





## .ip





## .url





## .method





## .path





## .secure





## .xhr
