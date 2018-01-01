# Reply

A reply is a method **returned from a middleware** that creates the response. These are the available methods and their parameters for `server.reply`:

|reply name                                 |example                     |final|
|-------------------------------------------|----------------------------|-----|
|[`cookie(name, value, opts)`](#cookie-)    |cookie('name', 'Francisco') |false|
|[`download(path[, filename])`](#download-) |download('resume.pdf')      |true |
|[`header(field[, value])`](#header-)       |header('ETag': '12345')     |false|
|[`json([data])`](#json-)                   |json({ hello: 'world' })    |true |
|[`jsonp([data])`](#jsonp-)                 |jsonp({ hello: 'world' })   |true |
|[`redirect([status,] path)`](#redirect-)   |redirect(302, '/')          |true |
|[`render(view[, locals])`](#render-)       |render('index.hbs')         |true |
|[`send([body])`](#send-)                   |send('Hello there')         |true |
|[`status(code)`](#status-)                 |status(200)                 |mixed|
|[`type(type)`](#type-)                     |type('html')                |false|

Examples:

```js
const { get, post } = require('server/router');
const { render, redirect, file } = require('server/reply');

module.exports = [
  get('/', ctx => render('index.hbs')),
  post('/', processRequest, ctx => redirect('/'))
];
```

<blockquote class="warning">
  Make sure to **return** the reply that you want to use. It won't work otherwise.
</blockquote>



The `ctx` argument is [explained in middleware's Context](/documentation/context). The reply methods can be imported in several ways:

```js
// For whenever you have previously defined `server`
const { send, json } = server.reply;

// For standalone files:
const { send, json } = require('server/reply');
```

There are many more ways of importing the reply methods, but those above are the recommended ones.


### Chainable

While most of the replies are final and they should be invoked only once, there are a handful of others that can be chained. These add something to the ongoing response:

- [cookie()](#cookie-): add cookie headers
- [header()](#header-): add any headers you want
- [status()](#status-): set the status of the response
- [type()](#type-): adds the header 'Content-Type'

You can chain those among themselves and any of those with a final method that sends. If no final method is called in any place the request will be finished with a 404 response.

The `status()` reply can be used as final or as chainable if something else is added.





### Return value

Both in synchronous mode or asyncrhonous mode you can just return a string to create a response:

```js
// Send a string
const middle = ctx => 'Hello 世界';

// Test it
const res = await run(middle).get('/');
expect(res.body).toBe('Hello 世界');
```

Returning an array or an object will stringify them as JSON:

```js
server(ctx => ['life', 42]);
// Note: extra parenthesis needed by the arrow function to return an object
server(ctx => ({ life: 42 }));
```

A single number will be interpreted as a status code and the corresponding body for that status will be returned:

```js
server(get('/nonexisting', => 404));
```


You can also throw anything to trigger an error:

```js
const middle = ({ req }) => {
  if (!req.body) {
    throw new Error('No body provided');
  }
}

const handler = error(ctx => ctx.error.message);

// Test it
const res = await run(middle, handler).get('/nonexisting');
expect(res.body).toBe('No body provided');
```




### Multiple replies

Another important thing is that the first reply used is the one that will be used. However, you should try to avoid this and we might make it more strict in the future:

```js
// I hope you speak Spanish
server([
  ctx => 'Hola mundo',
  ctx => 'Hello world',
  ctx => 'こんにちは、世界'
]);
```

To avoid this, just specify the url for each request in a [router](/documentation/router):

```js
// I hope you speak Spanish
server([
  get('/es', ctx => 'Hola mundo'),
  get('/en', ctx => 'Hello world'),
  get('/jp', ctx => 'こんにちは、世界')
]);
```

Then each of those URLs will use a different language.



## cookie()

Set a cookie on the browser. It will send the Set-Cookie headers:

```js
const { cookie } = server.reply;
const setCookie = ctx => cookie('foo', 'bar').send();

// Test
run(setCookie).get('/').then(res => {
  expect(res.headers['Set-Cookie:']).toMatch(/foo\=bar/);
});
```

| Key         | Default                |  Type             |
|-------------|------------------------|-------------------|
| `domain`    | Current domain         | String            |
| `encode`    | `encodeURIComponent`   | Function          |
| `expires`   | `undefined` (session)  | Date              |
| `httpOnly`  | `false`                | Boolean           |
| `maxAge`    | `undefined` (session)  | Number            |
| `path`      | `"/"`                  | String            |
| `secure`    | `false`                | Boolean           |
| `signed`    | `false`                | Boolean           |
| `sameSite`  | `false`                | Boolean or String |

See a better explanation of each one of those in [express' documentation](https://expressjs.com/en/4x/api.html#res.cookie).



## download()

An async function that takes a local path and an optional filename. It will return the local file with the filename name for the browser to download.

```js
server(ctx => download('user-file-5674354.pdf'));
server(ctx => download('user-file-5674354.pdf', 'report.pdf'));
```

You can handle errors for this method downstream:

```js
server([
  ctx => download('user-file-5674354.pdf'),
  error(ctx => { console.log(ctx.error); })
]);
```


## header()

Set a header to be sent with the response. It accepts two strings as key and value or an object to set multiple headers:

```js
const mid = ctx => header('Content-Type', 'text/plain');
const mid2 = ctx => header('Content-Length', '123');

// Same as above
const mid = ctx => header({
  'Content-Type': 'text/plain',
  'Content-Length': '123'
});
```



## json()

Sends a JSON response. It accepts a plain object or an array that will be stringified with `JSON.stringify`. Sets the correct `Content-Type` headers as well:

```js
const mid = ctx => json({ foo: 'bar' });

// Test it
run(mid).get('/').then(res => {
  expect(res.body).toEqual(`{"foo":"bar"}`);
});
```



## jsonp()

Same as [json()](#json) but wrapped with a callback. [Read more about JSONP](https://en.wikipedia.org/wiki/JSONP):

```js
const mid = ctx => jsonp({ foo: 'bar' });

// Test it
run(mid).get('/?callback=callback').then(res => {
  expect(res.body).toMatch('callback({foo:"bar"})');
});
```

It is useful for loading data Cross-Domain. The query `?callback=foo` **is mandatory** and you should set the callback name there:

```js
const mid = ctx => jsonp({ foo: 'bar' });

// Test it
run(mid).get('/?callback=foo').then(res => {
  expect(res.body).toMatch('foo({foo:"bar"})');
});
```



## redirect()

Redirects to the url specified. It can be either internal (just a path) or an external URL:

```js
const mid1 = ctx => redirect('/foo');
const mid2 = ctx => redirect('../user');
const mid3 = ctx => redirect('https://google.com');
const mid4 = ctx => redirect(301, 'https://google.com');
```


## render()

This is the most complex method and yet the most useful one. It takes a filename and some data and renders it:

```js
const mid1 = ctx => render('index.hbs');
const mid2 = ctx => render('index.hbs', { user: 'Francisco' });
```

The filename is relative to the [views option](/documentation/options/#-views-)  (defaults to `'views'`):

```js
// Renders PROJECT/somefolder/index.hbs
server({ views: 'somefolder' }, ctx => render('index.hbs'));
```

The extension of this filename is optional. It accepts by default `.hbs`, `.pug` and `.html` and can accept more types [installing other engines](/documentation/options/#-engine-):

```js
const mid1 = ctx => render('index.pug');
const mid2 = ctx => render('index.hbs');
const mid3 = ctx => render('index.html');
```

The data will be passed to the template engine. Note that some plugins might pass additional data as well.



## send()

Send the data to the front-end. It is the method used by default with [the raw returns](#raw-return):

```js
const mid1 = ctx => send('Hello 世界');
const mid2 = ctx => 'Hello 世界';
```

However it supports many more data types: String, object, Array or Buffer:

```js
const mid1 = ctx => send('Hello 世界');
const mid2 = ctx => send('<p>Hello 世界</p>');
const mid4 = ctx => send({ foo: 'bar' });
const mid3 = ctx => send(new Buffer('whatever'));
```

It also has the advantage that it can be chained, unlike just returning the string:

```js
const mid1 = ctx => status(201).send({ resource: 'foobar' });
const mid2 = ctx => status(404).send('Not found');
const mid3 = ctx => status(500).send({ error: 'our fault' });
```



## status()

Sets the status of the response. If no reply is done, it will become final and send that response message as the body:

```js
const mid1 = ctx => status(404);  // The same as:
const mid2 = ctx => status(404).send('Not found');
```



## type()

Set the `Content-Type` header for the response. It can be a explicit MIME type like these:

```js
const mid1 = ctx => type('text/html').send('<p>Hello</p>');
const mid2 = ctx => type('application/json').send(JSON.stringify({ foo: 'bar' }));
const mid3 = ctx => type('image/png').send(...);
```

Or you can also write their more friendly names for an equivalent result:

```js
const mid1 = ctx => type('.html');
const mid2 = ctx => type('html');
const mid3 = ctx => type('json');
const mid4 = ctx => type('application/json');
const mid5 = ctx => type('png');
```
