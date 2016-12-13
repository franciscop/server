# Server

The simplest yet a powerful way of launching a server with Node.js:

```js
let server = require('server');

// Launch it in port 3000 to serve static files in /public
server();

// Serve static files from the project root on http://localhost:8080/
server({ port: 8080, public: './' });

// Use some simple routes
let { get, post } = server.router;
server({},
  get('/', (req, res) => res.render('index')),
  post('/', (req, res) => console.log(req.body))
);
```

It parses urlencoded, json and files automatically with default middlewares while still letting you personalize the options or change those middlewares for others you prefer (or just remove them).

## Getting started

After getting Node ready and `npm init`, execute this from the terminal in your project folder to **install the server**:

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
  get('/', (req, res) => { res.send('Hello world!'); })
);
```

Execute this in the terminal to get the server started:

```bash
node app.js
```

And finally, open your browser on [localhost:3000](http://localhost:3000/) and you should see your server answered 'Hello world!'.

## Documentation

Everything is documented here:

<strong><a class="button" href="/documentation"><i class="fa fa-file-code-o"></i> Full Documentation</a></strong>

## License

Licensed under the MIT License. See `LICENSE` for the full license.

## Author

This package was created by [Francisco Presencia]() but hopefully developed and maintained by many others. See the [the list of contributors here](https://github.com/serverjs/server/graphs/contributors).
