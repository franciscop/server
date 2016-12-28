# Server

A simple, powerful and flexible server for Node.js:

```js
let server = require('server');

// Launch it in port 3000 to serve static files in /public on http://localhost:3000/
server();

// OR serve static files from the project root on http://localhost:8000/
server({ port: 8000, public: './' });

// OR use some simple routes on  on http://localhost:8080/
let { get, post } = server.router;
server({ port: 8080 },
  get('/', (req, res) => res.render('index')),
  post('/', (req, res) => console.log(req.body))
);
```

It parses cookies, forms, files, etc automatically with default middlewares while still letting you personalize the options or change those middlewares for others you prefer (or just remove them).



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
  get('/', (req, res) => res.send('Hello world!'))
);
```

Execute this in the terminal to get the server started:

```bash
node app.js
```

And finally, open your browser on [localhost:3000](http://localhost:3000/) and you should see your server answered 'Hello world!'.



## Documentation

Everything is documented in detail here:

<strong><a class="button" href="/documentation"><i class="fa fa-file-code-o"></i> Full Documentation</a></strong>

You can also download the repository and try the examples by browsing to them and `node app.js` inside each of them in `/examples`.



## License

Licensed under the MIT License. See `LICENSE` for the full license.



## Author

This package was created by [Francisco Presencia](http://francisco.io/) but hopefully developed and maintained by many others. See the [the list of contributors here](https://github.com/serverjs/server/graphs/contributors).



## Trivia

This website is NOT running on *server.js*. It doesn't make sense to run a custom server to display a static website so it's hosted on Github's Pages. From my personal projects I've migrated [Comments Network](https://comments.network/) so far to use server.js. You can see it integrated here:

<comment-box class="border" limit="20"></comment-box>
