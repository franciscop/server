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

/* test */
const res = await run({ port: 3012 }, mid, () => 200).get('/');
expect(res.status).toBe(200);
```

If we have a variable set in the `.env` or through some other environment variables, it'll use that instead as [environment options take preference](/documentation/options/):

```bash
# .env
PORT=80
```

```js
const mid = ctx => {
  expect(ctx.options.port).toBe(7693);
};

/* test */
const res = await run({ port: 7693 }, mid, () => 200).get('/');
expect(res.status).toBe(200);
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

To handle forms sent normally:

```pug
//- index.pug
form(method="POST" action="/contact")
  input(name="email")
  input(name="_csrf" value=csrf type="hidden")
  input(type="submit" value="Subscribe")
```

Then to parse the data from the back-end:

```js
const server = require('server');
const { get, post } = server.router;
const { render, redirect } = server.reply;

server([
  get(ctx => render('index.pug')),
  post(ctx => {
    console.log(ctx.data);  // Logs the email
    return redirect('/');
  })
]);
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

```js
const mid = del('/user/:id', ctx => {
  console.log('Delete user:', ctx.params.id);
});
```



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

After following the [sessions in production tutorial](localhost:3000/tutorials/sessions-production/), sessions should be ready to get rolling. This is an object that persist among the user refreshing the page and navigation:

```js
// Count how many pages the visitor sees
const mid = ctx => {
  ctx.session.counter = (ctx.session.counter || 0) + 1;
  return ctx.session.counter;
};

// Test that it works
run(ctx).alive(async ctx => {
  await api.get('/');
  await api.get('/');
  const res = await api.get('/');
  expect(res.body).toBe('3');
});
```



## .headers

Get the headers that were sent with the request:

```js
const mid = ctx => {
  expect(ctx.headers.answer).toBe(42);
};

// Test it
run(mid).get('/', { headers: { answer: 42 } });
```



## .cookie

Object that holds the cookies sent by the client:

```js
const mid = ctx => {
  console.log(ctx.cookies);
};

run(mid).get('/');
```



## .files

Contains any and all of the files sent by a request. It would normally be sent through a form with an `<input type="file">` field or through a [`FormData` in front-end  javascript](https://developer.mozilla.org/en-US/docs/Web/API/FormData):

```html
<form method="POST" action="/profilepic" enctype="multipart/form-data">
  <input name="profilepic" type="input">
  <input type="hidden" name="_csrf" value="{{_csrf}}">
  <input type="submit" value="Send picture">
</form>
```

Note the [csrf token](/documentation/router/#csrf-token) and the [`enctype="multipart/form-data"`](https://stackoverflow.com/q/1342506/938236), both of them needed. Then to handle it with Node.js:

```js
const mid = post('/profilepic', ctx => {
  // This comes from the "name" in the input field
  console.log(ctx.files.profilepic);
  return redirect('/profile');
});
```



## .ip

The IP of the remote client. If it's behind a proxy that displays its proxy condition then the `ips` field will also be filled with the respective ips:

```js
const mid = ctx => {
  console.log(ctx.ip, '|', ctx.ips);
};

run(mid).get('/');
```




## .url

The full cuantified URL:

```js
const mid = ctx => {
  expect(ctx.url).toBe('/hello?answer=42');
};

run(mid).get('/hello?answer=42');
```



## .method

The request method, it can be `GET`, `POST`, `PUT`, `DELETE`:

```js
const mid = ctx => {
  expect(ctx.method).toBe('GET');
};

// Test it
run(mid).get('/');
```

Or other methods:

```js
const mid = ctx => {
  expect(ctx.method).toBe('POST');
};

// Test it
run(noCsrf, mid).post('/');
```



## .path

Only the path part from the URL. It is the full URL except for the query:

```js
const mid = ctx => {
  expect(ctx.path).toBe('/question');
};

// Test it
run(mid).get('/question?answer=42');
```



## .secure

Returns true if the request is made through HTTPS. Take into account that if you are behind Cloudflare or similar it might be reported as false even though your clients see `https`:

```js
const mid = ctx => {
  expect(ctx.secure).toBe(false);
};

// Test it
run(mid).get('/');
```



## .xhr

A boolean set to true if the request was done through AJAX. Specifically, if `X-Requested-With` is `“XMLHttpRequest”`:

```js
const mid = ctx => {
  expect(mid.xhr).toBe(false);
};

run(mid).get('/');
```
