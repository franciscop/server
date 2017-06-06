# **server.js** for Node.js

  [![[Subscribe]](https://img.shields.io/badge/%20subscribe%20-%20mailchimp%20-blue.svg )](http://eepurl.com/cGRggH)
  [![[Status]](https://circleci.com/gh/franciscop/server.svg?style=shield)](https://circleci.com/gh/franciscop/server)
  [![[Windows Build]](https://img.shields.io/appveyor/ci/franciscop/server.svg?label=windows)](https://ci.appveyor.com/project/franciscop/server)
  [![[Downloads]](https://img.shields.io/npm/dm/server.svg)](https://npm-stat.com/charts.html?package=server)
  [![[Roadmap]](https://img.shields.io/badge/version-ALPHA-red.svg)](https://github.com/franciscop/server/issues/1)


Powerful server for Node.js that just works so **you can focus on your awesome project**:

```js
// Include it and extract some methods for convenience
const server = require('server');
const { get, post } = server.router;

// Launch server with options and a couple of routes
server({ port: 8080 }, [
  get('/', ctx => 'Hello world'),
  post('/', ctx => console.log(ctx.data))
]);
```



## Getting started

After [getting Node.js 8+ ready](https://en.libre.university/lesson/V1f6Btf8g/Getting started#Install-the-server) and doing `npm init` in your project folder, **install server** and keep it as a dependency in modern Node.js versions:

```bash
npm install server
```

Then you can create a file called `index.js` and set the following:

```js
// Include the server in your file
const server = require('server');
const { get, post } = server.router;

// Handle requests to the url "/" ( http://localhost:3000/ )
server([
  get('/', ctx => 'Hello world!')
]);
```

Execute this in the terminal to get the server started:

```bash
node .
```

And finally, open your browser on [localhost:3000](http://localhost:3000/) and you should see your server answered 'Hello world!'.



## Documentation

The library is documented here:

<strong><a class="button" href="https://serverjs.io/documentation/">Full Documentation</a></strong>

> [**Subscribe here**](http://eepurl.com/cGRggH) to receive tutorials when released. Tutorials are *good for learning* while the documentation is good for reference/quick use *once you know the basics*.

You can also download the repository and try the examples by browsing to them and `node .` inside each of them in `/examples`.



## Use cases

The package `server` is great for many situations. Let's see some of them:


### Small to medium projects

Everything works out of the box, you get great support for most features and you can easily tap into Express' middleware ecosystem. What's not to love?

Some of the included features: body and file parsers, cookies, sessions, websockets, Redis, gzip, favicon, csrf, SSL, etc. They just work so you will save a headache or two and can focus on your actual project. Get a simple form going:

```js
const server = require('server');
const { get, post } = server.router;
const { render, redirect } = server.reply;

server(
  get('/', () => render('index.pug')),
  post('/', ctx => {
    console.log(ctx.data);
    return redirect('/');
  })
);
```



### API design

From the flexibility and expressivity of the bundle, designing APIs is a breeze:

```js
// books/router.js
const { get, post, put, del } = require('server/router');
const ctrl = require('./controller');

module.exports = [
  get('/book', ctrl.list),
  get('/book/:id', ctrl.item),
  post('/book', ctrl.create),
  put('/book/:id', ctrl.update),
  del('/book/:id', ctrl.delete)
];
```



### Real time

> Upcoming feature

Websockets were never this easy to use! With socket.io on the front-end, you can simply do this in the back-end to handle those events:

```js
// chat/router.js
const socket = require('server/router/socket');
const ctrl = require('./controller');

module.exports = [
  socket('connect', ctrl.join),
  socket('message', ctrl.message),
  socket('disconnect', ctrl.leave)
];
```



## License

Licensed under the MIT License. See [LICENSE](https://github.com/franciscop/server/blob/master/LICENSE) for the full license.



## Author & support

This package was created by [Francisco Presencia](http://francisco.io/) but hopefully developed and maintained by many others. See the [the list of contributors here](https://github.com/franciscop/server/graphs/contributors).

I love using my work and I'm available for contractor work. Freelancing helps maintain `server` and [my other open source projects](https://github.com/franciscop/) up to date! I am also on [Codementor](https://www.codementor.io/franciscop) so if you want to learn more Javascript/Node.js/etc contact me there.

You can also [sponsor the project](https://serverjs.io/sponsor), get your logo in here and some other perks with tons of ♥
