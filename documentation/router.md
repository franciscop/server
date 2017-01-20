## Router

In the end of the day, routes are just a specific kind of middleware. There are many ways of including them, however we recommend these two:



### Simple router

To define a simple router, you could do:

```js
const server = require('server');

// Import methods 'get' and 'post' from the router
let { get, post } = server.router;

server(3000,
  get('/users', (req, res) => { /* ... */ }),
  post('/users', (req, res) => { /* ... */ })
);
```



### Complex router

If you are going to have many routes, we recommend splitting it into a separated file, either in the root of the project as `routes.js` or in a different place:

```js
// app.js
const server = require('server');
let routes = require('./routes');

server(3000, routes);
```

```js
// routes.js
let { get, post } = require('server').router;
let ctrl = require('auto-load')('controllers');

// You can simply export an array of routes
module.exports = [
  get('/', ctrl.home.index),
  get('/users', ctrl.users.index),
  post('/users', ctrl.users.add),
  get('/photos', ctrl.photos.index),
  post('/photos', ctrl.photos.add),
  ...
];
```



### Express router

You can also use the express router:

```js
const server = require('server');

let router = server.express.Router();
router.get('/', home.index);
router.get('/users', users.index);
// ...

server({}, router);
```

However, we recommend using server's router whenever possible:

```js
const server = require('server');
let { get, post } = server.router;

server({}, [
  get('/', home.index),
  get('/users', users.index)
]);
```



### Join routes

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


### Experimental

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



### Websockets

> *Not yet available, coming in version 1.1*

```js
const server = require('server');
let { get, socket } = server.router;

server({}, [
  get('/', (req, res) => res.sendFile(__dirname + '/public/index.html')),
  socket('message', (data, socket, io) => {
    io.emit(data);
  })
]);
```
