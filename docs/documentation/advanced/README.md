# Advanced

Some of the concepts that you won't find day-to-day but that might be useful when debugging or creating your own libraries.



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


## Experimental

> To enable these, you'll have to add an `EXPERIMENTAL=1` to your environment variables. No need to say that this is not stable and not part of the stable API.

There's an experimental way of dealing with those:

```js
server({}, [
  get('/').send('Hello 世界'),
  get('/about.html').file('public/about.html'),
  get('/non-existing').status(404).send('Error 404!')
]);
```

They are the same methods as in [Express Methods](http://expressjs.com/en/api.html#res.methods) and accept the same parameters (adding `file`, which is an alias of `sendFile`, and removing `get` and `set` as it conflicts with `Router.get` and `Router.set`). The ones that *do not send* a response can be concatenated, while the ones that send a response will be ignored. So the second *send* will be ignored:

```js
server({}, [
  get('/').status(200).send('Hi there').send('I am ignored')
]);
```
