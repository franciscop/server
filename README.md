# Server

**Simple and powerful server** for Node.js:

```js
const server = require('server');

// Serve static files from /public on port 3000
server();

// OR serve static files from the root on port 8080
server({ port: 8080, public: './' });

// OR use some simple routes on http://localhost:3000/
const { get, post } = server.router;
server(
  get('/', ctx => ctx.res.render('index')),
  post('/', ctx => console.log(ctx.req.body))
);
```



## Getting started

After getting Node ready and `npm init`, run this in your project folder to **install the server**:

```bash
npm install server --save
```

Then you can create a file called `app.js` and set the following:

```js
// Include the server in your file
let server = require('server');
let { get, post } = server.router;

// Initialize the server on port 3000
server(3000,

  // Handle requests to the url "/" ( http://localhost:3000/ )
  get('/', ctx => ctx.res.send('Hello world!'))
);
```

Execute this in the terminal to get the server started:

```bash
node app.js
```

And finally, open your browser on [localhost:3000](http://localhost:3000/) and you should see your server answered 'Hello world!'.



## Documentation

Everything is documented in detail here:

<strong><a class="button" href="/documentation">Full Documentation</a></strong>

You can also download the repository and try the examples by browsing to them and `node app.js` inside each of them in `/examples`.



## License

Licensed under the MIT License. See [LICENSE](https://github.com/franciscop/server/blob/master/LICENSE) for the full license.



## Author

This package was created by [Francisco Presencia](http://francisco.io/) but hopefully developed and maintained by many others. See the [the list of contributors here](https://github.com/franciscop/server/graphs/contributors).



## Hire me

I love using my work in real life and I'm available for contractor work. My freelancing helps keep `server` and [my other open source projects](https://github.com/franciscop/) up to date! Hire me to do:

- Front-end: [Picnic CSS](http://picnicss.com/) ♦ [Paperdocs](http://francisco.io/paperdocs) ♦ [Angular Attack](http://angularattack.com/) ♦ [Ruby Rampage](https://www.rubyrampage.com/) ♦ [Server JS website](https://serverjs.io/)
- Full-stack: [Makers UPV](https://makersupv.com/) ♦ [Learning vocabulary](http://anchor.science/)
- Back-end: [Server JS (the library)](http://serverjs.io/) ♦ [Drive DB](https://github.com/franciscop/drive-db) ♦  [Express Data Parser](https://github.com/franciscop/express-data-parser)

Find my email [in my website](http://francisco.io/).
