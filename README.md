# **server.js** for Node.js

[![[Subscribe]](https://img.shields.io/badge/%20subscribe%20-%20mailchimp%20-blue.svg )](http://eepurl.com/cGRggH)
[![[Downloads]](https://img.shields.io/npm/dm/server.svg)](https://npm-stat.com/charts.html?package=server)
[![[Status]](https://circleci.com/gh/franciscop/server.svg?style=shield)](https://circleci.com/gh/franciscop/server)
[![[Windows Build]](https://img.shields.io/appveyor/ci/franciscop/server.svg?label=windows)](https://ci.appveyor.com/project/franciscop/server)
[![[Dependencies status]](https://david-dm.org/franciscop/server/status.svg)](https://david-dm.org/franciscop/server)

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

<blockquote class="external">
  <p>Simplicity is a great virtue but it requires hard work to achieve it and education to appreciate it. And to make matters worse: complexity sells better.</p>
  <cite>― Edsger W. Dijkstra</cite>
</blockquote>


## Getting started

There's a [whole tutorial on getting started for beginners](https://serverjs.io/tutorials/getting-started/) but the quick version is to first install `server` as a dependency:

> Security Incident: if you have installed server.js between January 15th and February 15th, make sure to read [the incident report](https://github.com/franciscop/server/issues/73) and update server by doing `npm install server@1.0`.

```bash
npm install server
```

> Server requires **Node.js 7.6.0** or newer. **Node.js 8.9.x** LTS is recommended for long-term support from Node.js.

Then you can create a file called `index.js` with this code:

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

And finally, open your browser on [localhost:3000](http://localhost:3000/) and you should see 'Hello world!' on your browser.



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

Server can handle most templating frameworks including Handlebars, Pug, Nunjucks, others.  For Nunjucks, simply include the nunjucks library in your heading and use a slighly modified get() request with nunjucks.render() as your ctx =>.

```js
const nunjucks = require('nunjucks');

server([
  get('/', ctx => nunjucks.render('home.hbs', Object.assign({}, ctx.locals, 
     { key: "value" }
  )))

]);
```

### Templating

Server can handle most templating



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

Websockets were never this easy to use! With socket.io on the front-end, you can simply do this in the back-end to handle those events:

```js
// chat/router.js
const { socket } = require('server/router');
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
