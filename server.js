let dotenv = require('dotenv');
dotenv.config({ silent: true });

// Modules
let express = require('express');
let bodyParser = require('body-parser');
let dataParser = require('express-data-parser');
let expressSession = require('express-session');
let cookieParser = require('cookie-parser');
let loadware = require('loadware');

let extend = require('extend');    // deep-copy, not shallow like Object.assign
let config = require('./config');  // default configuration

module.exports = (opts = {}, ...middle) => new Promise((resolve, reject) => {
  let app = express();

  // If it's a number it's the port
  if (typeof opts === 'number') {
    opts = { port: opts };
  }

  // Set the default options (deep-copy it)
  opts = extend(true, {}, config(opts), opts);

  for (let key in opts) {
    if (key !== 'middle') {
      app.set(key, opts[key]);
    }
  }

  // Loads the middleware into the app
  loadware({
    static: express.static(opts.public),
    jsonparser: bodyParser.json(),
    bodyparser: bodyParser.urlencoded(opts.middle.bodyparser),
    dataparser: dataParser(opts.middle.dataparser),
    session: expressSession(opts.middle.session),
    cookies: cookieParser(opts.middle.cookies)
  }, middle).forEach(mid => app.use(mid));

  // Actually start listening to the requests
  let port = process.env.PORT || opts.port;

  let server = {};
  server.options = opts;
  server.app = app;
  server.original = server.app.listen(port, () => {
    if (server.options.verbose) {
      console.log(`Server started on port ${port} http://localhost:${port}/`);
    }

    // Proxy it to the original http-server
    server = new Proxy(server, {
      get: (ser, key) => {
        return ser[key] || ser.original[key];
      }
    });
    resolve(server);
  });
  server.original.on('error', err => {
    reject(err);
  });
});

module.exports.express = express;

module.exports.router = new Proxy({}, {
  get: (orig, key) => (...args) => {
    let router = express.Router();
    router[key](...args);
    return router;
  }
});
