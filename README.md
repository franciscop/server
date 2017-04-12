# **Server** for Node.js

[![[Subscribe]](https://img.shields.io/badge/%20subscribe%20-%20mailchimp%20-blue.svg )](http://eepurl.com/cGRggH) [![[Status]](https://circleci.com/gh/franciscop/server.svg?style=shield)](https://circleci.com/gh/franciscop/server) [![[Downloads]](https://img.shields.io/npm/dm/server.svg)](https://www.npmjs.com/package/server) [![[Roadmap]](https://img.shields.io/badge/version-ALPHA-red.svg)](https://github.com/franciscop/server/issues/1)


Simple and powerful server that just works so **you can focus on your awesome project**:

```js
// Include it and extract some methods for convenience
const server = require('server');
const { get, post } = server.router;

// Launch server with some opts and a couple of routes
server({ port: 8080, public: './' }, [
  get('/', ctx => ctx.res.render('index')),
  post('/', ctx => console.log(ctx.req.body))
]);
```



## Getting started

After getting Node.js (`> 7.6`) ready and doing `npm init` in your project folder, **install server** and keep it as a dependency:

```bash
npm install server --save
```

Then you can create a file called `app.js` and set the following:

```js
// Include the server in your file
const server = require('server');
const { get, post } = server.router;

// Handle requests to the url "/" ( http://localhost:3000/ )
server([
  get('/', ctx => ctx.res.send('Hello world!'))
]);
```

Execute this in the terminal to get the server started:

```bash
node app.js
```

And finally, open your browser on [localhost:3000](http://localhost:3000/) and you should see your server answered 'Hello world!'.



## Documentation

The library documented is here:

<strong><a class="button" href="https://serverjs.io/documentation/">Full Documentation</a></strong>

> [**Subscribe here**](http://eepurl.com/cGRggH) to receive tutorials when released. Tutorials are *good for learning* while the documentation is good for reference/quick use *once you know the basics*.

You can also download the repository and try the examples by browsing to them and `node app.js` inside each of them in `/examples`.



## License

Licensed under the MIT License. See [LICENSE](https://github.com/franciscop/server/blob/master/LICENSE) for the full license.



## Author

This package was created by [Francisco Presencia](http://francisco.io/) but hopefully developed and maintained by many others. See the [the list of contributors here](https://github.com/franciscop/server/graphs/contributors).

I love using my work and I'm available for contractor work. Freelancing helps maintain `server` and [my other open source projects](https://github.com/franciscop/) up to date!

You can also [sponsor the project](/sponsor), get your logo in here and some other perks with tons of ♥
